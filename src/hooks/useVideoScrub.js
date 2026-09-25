import { useEffect, useRef, useState } from "react";
import MP4Box from "mp4box";
const LERP_TAU = 8;
const SNAP = 2e-3;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 6e4;
function useVideoScrub({
  videoSrc,
  videoRef,
  canvasRef,
  containerRef
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const stateRef = useRef({
    current: 0,
    target: 0,
    dur: 0,
    ready: false,
    reverted: false,
    painted: false,
    building: false,
    bank: [],
    lru: /* @__PURE__ */ new Map(),
    lastTime: 0
  });
  const getProgress = () => {
    const container = containerRef.current;
    if (!container) return 0;
    const scrollSpan = container.offsetHeight - window.innerHeight;
    if (scrollSpan <= 0) return 0;
    const rawProgress = window.scrollY / scrollSpan;
    return Math.max(0, Math.min(1, rawProgress));
  };
  const findNearestIndex = (targetUs) => {
    const bank = stateRef.current.bank;
    if (bank.length === 0) return -1;
    let low = 0;
    let high = bank.length - 1;
    while (low <= high) {
      const mid = low + high >> 1;
      if (bank[mid].js < targetUs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (low >= bank.length) return bank.length - 1;
    if (high < 0) return 0;
    return Math.abs(bank[low].js - targetUs) < Math.abs(bank[high].js - targetUs) ? low : high;
  };
  const warmLRU = (centerIdx) => {
    const { bank, lru } = stateRef.current;
    if (bank.length === 0) return;
    for (let offset = -1; offset <= 2; offset++) {
      const idx = centerIdx + offset;
      if (idx >= 0 && idx < bank.length && !lru.has(idx)) {
        lru.set(idx, null);
        createImageBitmap(bank[idx].blob).then((bmp) => {
          if (lru.has(idx)) {
            lru.set(idx, bmp);
          } else {
            bmp.close();
          }
        }).catch(() => {
          lru.delete(idx);
        });
        if (lru.size > LRU_MAX) {
          const oldestKey = lru.keys().next().value;
          if (oldestKey !== void 0) {
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
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onLoadedMetadata);
    };
  }, [videoRef]);
  useEffect(() => {
    let animId;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frameLoop = (time) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = time;
      const deltaSeconds = (time - s.lastTime) / 1e3;
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
        if (s.ready && !s.reverted && s.bank.length > 0 && canvas) {
          const targetUs = s.current * 1e6;
          const nearestIdx = findNearestIndex(targetUs);
          if (nearestIdx >= 0) {
            warmLRU(nearestIdx);
            const bitmap = s.lru.get(nearestIdx);
            if (bitmap) {
              const ctx = canvas.getContext("2d");
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
  useEffect(() => {
    const handleResize = () => {
      const p = getProgress();
      setScrollProgress(p);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  useEffect(() => {
    let active = true;
    let watchdogTimer = null;
    const buildFrameBank = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof window.VideoDecoder === "undefined" || typeof window.EncodedVideoChunk === "undefined") {
        return;
      }
      stateRef.current.building = true;
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
        let trackInfo = null;
        const configHolder = { current: null };
        const samplesQueue = [];
        let samplesExtracted = false;
        mp4boxFile.onError = (e) => {
          console.warn("MP4Box error, using video fallback:", e);
        };
        mp4boxFile.onReady = (info) => {
          if (!info.videoTracks || info.videoTracks.length === 0) return;
          trackInfo = info.videoTracks[0];
          if (info.duration && info.timescale) {
            const d = info.duration / info.timescale;
            if (d > 0 && !stateRef.current.dur) {
              stateRef.current.dur = d;
              setDuration(d);
            }
          }
          let description = void 0;
          try {
            const trak = mp4boxFile.getTrackById(trackInfo.id);
            if (trak?.mdia?.minf?.stbl?.stsd?.entries) {
              for (const entry of trak.mdia.minf.stbl.stsd.entries) {
                const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
                if (box) {
                  const stream = new MP4Box.DataStream(void 0, 0, MP4Box.DataStream.BIG_ENDIAN);
                  box.write(stream);
                  description = new Uint8Array(stream.buffer, 8);
                  break;
                }
              }
            }
          } catch (descErr) {
            console.warn("Could not extract box description:", descErr);
          }
          configHolder.current = {
            codec: trackInfo.codec,
            codedWidth: trackInfo.video?.width || trackInfo.track_width,
            codedHeight: trackInfo.video?.height || trackInfo.track_height,
            description,
            hardwareAcceleration: "no-preference"
          };
          mp4boxFile.setExtractionOptions(trackInfo.id, null, { nbSamples: 1e3 });
          mp4boxFile.start();
        };
        mp4boxFile.onSamples = (_id, _user, samples) => {
          samplesQueue.push(...samples);
        };
        const fileBuffer = buffer;
        fileBuffer.fileStart = 0;
        mp4boxFile.appendBuffer(fileBuffer);
        mp4boxFile.flush();
        samplesExtracted = true;
        if (!configHolder.current || samplesQueue.length === 0) return;
        const activeConfig = { ...configHolder.current };
        const offscreen = document.createElement("canvas");
        if (trackInfo) {
          offscreen.width = trackInfo.video?.width || trackInfo.track_width || 1920;
          offscreen.height = trackInfo.video?.height || trackInfo.track_height || 1080;
        } else {
          offscreen.width = 1920;
          offscreen.height = 1080;
        }
        const offCtx = offscreen.getContext("2d");
        const tempBank = [];
        let pendingFrames = 0;
        const startDecoding = async (config) => {
          return new Promise((resolve) => {
            let failed = false;
            const decoder = new VideoDecoder({
              output: async (frame) => {
                if (!active || failed) {
                  frame.close();
                  return;
                }
                pendingFrames++;
                const ts = frame.timestamp;
                if (offCtx) {
                  offCtx.drawImage(frame, 0, 0, offscreen.width, offscreen.height);
                }
                frame.close();
                offscreen.toBlob(
                  (blob) => {
                    pendingFrames--;
                    if (blob && active) {
                      tempBank.push({ ts, blob });
                    }
                  },
                  "image/webp",
                  0.82
                );
              },
              error: (e) => {
                console.warn("VideoDecoder error:", e);
                failed = true;
                resolve(false);
              }
            });
            try {
              decoder.configure(config);
            } catch (cfgErr) {
              console.warn("Decoder configure failed:", cfgErr);
              resolve(false);
              return;
            }
            (async () => {
              for (const sample of samplesQueue) {
                if (!active || failed) break;
                while (pendingFrames > LEAD) {
                  await new Promise((r) => setTimeout(r, 8));
                }
                const chunk = new EncodedVideoChunk({
                  type: sample.is_sync ? "key" : "delta",
                  timestamp: 1e6 * sample.cts / sample.timescale,
                  duration: 1e6 * sample.duration / sample.timescale,
                  data: sample.data
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
        let success = await startDecoding(activeConfig);
        if (!success && active) {
          console.info("Retrying WebCodecs with prefer-software...");
          tempBank.length = 0;
          activeConfig.hardwareAcceleration = "prefer-software";
          success = await startDecoding(activeConfig);
        }
        if (success && tempBank.length > 0 && active) {
          tempBank.sort((a, b) => a.js - b.js);
          stateRef.current.bank = tempBank;
          stateRef.current.ready = true;
          setIsReady(true);
          clearTimeout(watchdogTimer);
        }
      } catch (err) {
        console.warn("WebCodecs frame extraction failed, falling back to video currentTime scrub:", err);
        if (active) {
          stateRef.current.reverted = true;
          setCanvasLive(false);
        }
      }
    };
    if (document.readyState === "complete") {
      buildFrameBank();
    } else {
      window.addEventListener("load", buildFrameBank);
      return () => {
        window.removeEventListener("load", buildFrameBank);
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
    duration
  };
}
export {
  useVideoScrub
};
