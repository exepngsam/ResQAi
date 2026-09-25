import { useEffect, useRef, useState } from 'react';
import MP4Box from 'mp4box';

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 60000;

interface UseVideoScrubOptions {
  videoSrc: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLElement>;
}

interface FrameBankItem {
  ts: number; // in microseconds
  blob: Blob;
}

export function useVideoScrub({
  videoSrc,
  videoRef,
  canvasRef,
  containerRef,
}: UseVideoScrubOptions) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);

  // References for mutable animation state
  const stateRef = useRef({
    current: 0,
    target: 0,
    dur: 0,
    ready: false,
    reverted: false,
    painted: false,
    building: false,
    bank: [] as FrameBankItem[],
    lru: new Map<number, ImageBitmap | null>(),
    lastTime: 0,
  });

  // Calculate scroll progress [0, 1]
  const getProgress = () => {
    const container = containerRef.current;
    if (!container) return 0;
    const scrollSpan = container.offsetHeight - window.innerHeight;
    if (scrollSpan <= 0) return 0;
    const rawProgress = window.scrollY / scrollSpan;
    return Math.max(0, Math.min(1, rawProgress));
  };

  // Binary search for nearest frame in bank
  const findNearestIndex = (targetUs: number) => {
    const bank = stateRef.current.bank;
    if (bank.length === 0) return -1;
    let low = 0;
    let high = bank.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (bank[mid].ts < targetUs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (low >= bank.length) return bank.length - 1;
    if (high < 0) return 0;
    return Math.abs(bank[low].ts - targetUs) < Math.abs(bank[high].ts - targetUs) ? low : high;
  };

  // Warm LRU bitmap cache around nearest index
  const warmLRU = (centerIdx: number) => {
    const { bank, lru } = stateRef.current;
    if (bank.length === 0) return;

    for (let offset = -1; offset <= 2; offset++) {
      const idx = centerIdx + offset;
      if (idx >= 0 && idx < bank.length && !lru.has(idx)) {
        lru.set(idx, null); // mark pending
        createImageBitmap(bank[idx].blob)
          .then((bmp) => {
            // Check if still in LRU or evicted
            if (lru.has(idx)) {
              lru.set(idx, bmp);
            } else {
              bmp.close();
            }
          })
          .catch(() => {
            lru.delete(idx);
          });

        // Enforce LRU size limit
        if (lru.size > LRU_MAX) {
          const oldestKey = lru.keys().next().value;
          if (oldestKey !== undefined) {
            const oldBmp = lru.get(oldestKey);
            if (oldBmp) {
              oldBmp.close();
            }
            lru.delete(oldestKey);
          }
        }
      }
    }
  };

  // Duration synchronization from HTMLVideoElement
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        stateRef.current.dur = video.duration;
        setDuration(video.duration);
      }
    };

    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      onLoadedMetadata();
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('durationchange', onLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('durationchange', onLoadedMetadata);
    };
  }, [videoRef]);

  // Main rAF animation & scrub loop
  useEffect(() => {
    let animId: number;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const frameLoop = (time: number) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = time;
      const deltaSeconds = (time - s.lastTime) / 1000;
      s.lastTime = time;
      const dt = Math.min(0.1, deltaSeconds);

      const p = getProgress();
      setScrollProgress(p);

      if (s.dur > 0) {
        s.target = p * s.dur;

        if (mediaQuery.matches) {
          s.current = s.target;
        } else {
          s.current += (s.target - s.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(s.target - s.current) < SNAP) {
            s.current = s.target;
          }
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // WebCodecs frame-bank rendering if ready
        if (s.ready && !s.reverted && s.bank.length > 0 && canvas) {
          const targetUs = s.current * 1e6;
          const nearestIdx = findNearestIndex(targetUs);
          if (nearestIdx >= 0) {
            warmLRU(nearestIdx);
            const bitmap = s.lru.get(nearestIdx);
            if (bitmap) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                if (!s.painted) {
                  s.painted = true;
                  setCanvasLive(true);
                }
              }
            }
          }
        } else if (video) {
          // Fallback: direct currentTime seeking on video element
          if (!video.seeking && Math.abs(video.currentTime - s.current) > 0.01) {
            video.currentTime = s.current;
          }
        }
      }

      animId = requestAnimationFrame(frameLoop);
    };

    animId = requestAnimationFrame(frameLoop);
    return () => cancelAnimationFrame(animId);
  }, [videoRef, canvasRef, containerRef]);

  // Window resize & orientation handlers
  useEffect(() => {
    const handleResize = () => {
      const p = getProgress();
      setScrollProgress(p);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // WebCodecs Frame Bank Extraction (after window load)
  useEffect(() => {
    let active = true;
    let watchdogTimer: any = null;

    const buildFrameBank = async () => {
      // Skip if reduced motion or already building or WebCodecs not supported
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof window.VideoDecoder === 'undefined' ||
        typeof window.EncodedVideoChunk === 'undefined'
      ) {
        return;
      }

      stateRef.current.building = true;

      // 60s watchdog to gracefully revert to video element fallback if decode stalls
      watchdogTimer = setTimeout(() => {
        if (!stateRef.current.painted && active) {
          stateRef.current.reverted = true;
          setCanvasLive(false);
        }
      }, WATCHDOG);

      try {
        const response = await fetch(videoSrc);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (!active) return;

        const mp4boxFile = MP4Box.createFile();
        let trackInfo: any = null;
        const configHolder: { current: VideoDecoderConfig | null } = { current: null };
        const samplesQueue: any[] = [];
        let samplesExtracted = false;

        mp4boxFile.onError = (e: any) => {
          console.warn('MP4Box error, using video fallback:', e);
        };

        mp4boxFile.onReady = (info: any) => {
          if (!info.videoTracks || info.videoTracks.length === 0) return;
          trackInfo = info.videoTracks[0];

          // Compute duration if available from mp4box
          if (info.duration && info.timescale) {
            const d = info.duration / info.timescale;
            if (d > 0 && !stateRef.current.dur) {
              stateRef.current.dur = d;
              setDuration(d);
            }
          }

          // Build codec configuration description box (avcC / hvcC / etc.)
          let description: Uint8Array | undefined = undefined;
          try {
            const trak = (mp4boxFile as any).getTrackById(trackInfo.id);
            if (trak?.mdia?.minf?.stbl?.stsd?.entries) {
              for (const entry of trak.mdia.minf.stbl.stsd.entries) {
                const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
                if (box) {
                  const stream = new (MP4Box as any).DataStream(undefined, 0, (MP4Box as any).DataStream.BIG_ENDIAN);
                  box.write(stream);
                  description = new Uint8Array(stream.buffer, 8);
                  break;
                }
              }
            }
          } catch (descErr) {
            console.warn('Could not extract box description:', descErr);
          }

          configHolder.current = {
            codec: trackInfo.codec,
            codedWidth: trackInfo.video?.width || trackInfo.track_width,
            codedHeight: trackInfo.video?.height || trackInfo.track_height,
            description: description,
            hardwareAcceleration: 'no-preference',
          };

          mp4boxFile.setExtractionOptions(trackInfo.id, null, { nbSamples: 1000 });
          mp4boxFile.start();
        };

        mp4boxFile.onSamples = (_id: number, _user: any, samples: any[]) => {
          samplesQueue.push(...samples);
        };

        const fileBuffer = buffer as ArrayBuffer & { fileStart: number };
        fileBuffer.fileStart = 0;
        mp4boxFile.appendBuffer(fileBuffer);
        mp4boxFile.flush();
        samplesExtracted = true;

        if (!configHolder.current || samplesQueue.length === 0) return;
        const activeConfig: VideoDecoderConfig = { ...configHolder.current };

        // Initialize VideoDecoder
        const offscreen = document.createElement('canvas');
        if (trackInfo) {
          offscreen.width = trackInfo.video?.width || trackInfo.track_width || 1920;
          offscreen.height = trackInfo.video?.height || trackInfo.track_height || 1080;
        } else {
          offscreen.width = 1920;
          offscreen.height = 1080;
        }
        const offCtx = offscreen.getContext('2d');

        const tempBank: FrameBankItem[] = [];
        let pendingFrames = 0;

        const startDecoding = async (config: VideoDecoderConfig): Promise<boolean> => {
          return new Promise((resolve) => {
            let failed = false;

            const decoder = new VideoDecoder({
              output: async (frame: VideoFrame) => {
                if (!active || failed) {
                  frame.close();
                  return;
                }

                pendingFrames++;
                const ts = frame.timestamp; // microseconds
                if (offCtx) {
                  offCtx.drawImage(frame, 0, 0, offscreen.width, offscreen.height);
                }
                frame.close();

                // Convert offscreen canvas to WebP Blob (quality 0.82)
                offscreen.toBlob(
                  (blob) => {
                    pendingFrames--;
                    if (blob && active) {
                      tempBank.push({ ts, blob });
                    }
                  },
                  'image/webp',
                  0.82
                );
              },
              error: (e) => {
                console.warn('VideoDecoder error:', e);
                failed = true;
                resolve(false);
              },
            });

            try {
              decoder.configure(config);
            } catch (cfgErr) {
              console.warn('Decoder configure failed:', cfgErr);
              resolve(false);
              return;
            }

            // Decode samples with throttling via LEAD to avoid outrunning blob encoder
            (async () => {
              for (const sample of samplesQueue) {
                if (!active || failed) break;

                while (pendingFrames > LEAD) {
                  await new Promise((r) => setTimeout(r, 8));
                }

                const chunk = new EncodedVideoChunk({
                  type: sample.is_sync ? 'key' : 'delta',
                  timestamp: (1e6 * sample.cts) / sample.timescale,
                  duration: (1e6 * sample.duration) / sample.timescale,
                  data: sample.data,
                });

                decoder.decode(chunk);
              }

              if (!failed) {
                await decoder.flush();
                while (pendingFrames > 0) {
                  await new Promise((r) => setTimeout(r, 10));
                }
                decoder.close();
                resolve(true);
              }
            })();
          });
        };

        // Attempt hardware / default decode first
        let success = await startDecoding(activeConfig);

        // If hardware decode failed, retry once with hardwareAcceleration: 'prefer-software'
        if (!success && active) {
          console.info('Retrying WebCodecs with prefer-software...');
          tempBank.length = 0;
          activeConfig.hardwareAcceleration = 'prefer-software';
          success = await startDecoding(activeConfig);
        }

        if (success && tempBank.length > 0 && active) {
          tempBank.sort((a, b) => a.ts - b.ts);
          stateRef.current.bank = tempBank;
          stateRef.current.ready = true;
          setIsReady(true);
          clearTimeout(watchdogTimer);
        }
      } catch (err) {
        console.warn('WebCodecs frame extraction failed, falling back to video currentTime scrub:', err);
        if (active) {
          stateRef.current.reverted = true;
          setCanvasLive(false);
        }
      }
    };

    if (document.readyState === 'complete') {
      buildFrameBank();
    } else {
      window.addEventListener('load', buildFrameBank);
      return () => {
        window.removeEventListener('load', buildFrameBank);
        active = false;
        if (watchdogTimer) clearTimeout(watchdogTimer);
      };
    }

    return () => {
      active = false;
      if (watchdogTimer) clearTimeout(watchdogTimer);
    };
  }, [videoSrc]);

  return {
    scrollProgress,
    canvasLive,
    isReady,
    duration,
  };
}
