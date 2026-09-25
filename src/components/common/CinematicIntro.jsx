import { useState, useEffect } from "react";
import { ShieldAlert, ArrowRight, Radio } from "lucide-react";
import { Button } from "./Button";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4";

const CinematicIntro = ({ onEnter }) => {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    try {
      localStorage.setItem("resqai_intro_seen", "true");
    } catch {
      // ignore
    }
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-black transition-opacity duration-700 select-none ${
        exiting ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 brightness-75 filter contrast-125"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bottom-blur z-10" />

      {/* Top Header Tag */}
      <div className="relative z-20 flex items-center justify-between animate-blur-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/90 border border-red-500 flex items-center justify-center text-white shadow-lg shadow-red-950/60">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-tighter text-sm text-white">
            RESQ<span className="text-red-500">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[10px] font-mono text-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE EMERGENCY NETWORK</span>
        </div>
      </div>

      {/* Center Cinematic Hero Typography */}
      <div className="relative z-20 max-w-3xl my-auto animate-blur-fade-up delay-200">
        <div className="text-[11px] md:text-xs font-mono font-semibold tracking-widest text-secondary uppercase mb-3 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>AUTONOMOUS OPERATIONAL INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white leading-none">
          TURN CHAOS<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
            INTO ACTION.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-secondary mt-5 max-w-xl font-normal leading-relaxed">
          Real-time multi-source disaster fusion, explainable risk assessment, and human-in-the-loop tactical rescue mission coordination.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-8">
          <Button
            size="lg"
            variant="primary"
            onClick={handleEnter}
            icon={ArrowRight}
            iconPosition="right"
            className="shadow-2xl shadow-white/20 font-semibold"
          >
            ENTER COMMAND CENTER
          </Button>

          <Button
            size="lg"
            variant="glass"
            onClick={handleEnter}
            className="text-secondary hover:text-white"
          >
            QUICK DASHBOARD
          </Button>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-20 flex items-center justify-between text-[11px] font-mono text-muted border-t border-white/[0.08] pt-4 animate-blur-fade-up delay-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-secondary font-semibold">SYSTEM ONLINE</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">MAHANADI FLOOD SECTOR ACTIVE</span>
        </div>

        <div className="text-[10px] text-muted">
          SECURE PROTOCOL NDMA / NDRF v2.4
        </div>
      </div>
    </div>
  );
};

export { CinematicIntro };
