import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { toast } from "../../utils/toast";

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = toast.subscribe((item) => {
      setToasts((prev) => [...prev, item]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 4500);
    });

    return () => unsub();
  }, []);

  const handleDismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((t) => {
        const borderColors = {
          success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
          error: "border-red-500/50 bg-red-950/50 text-red-200",
          warning: "border-amber-500/40 bg-amber-950/40 text-amber-200",
          info: "border-white/10 bg-surface-elevated/90 text-slate-200"
        };

        const Icon =
          t.type === "success"
            ? CheckCircle2
            : t.type === "error"
            ? AlertCircle
            : t.type === "warning"
            ? AlertTriangle
            : Info;

        return (
          <div
            key={t.id}
            className={`toast-enter pointer-events-auto p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all ${
              borderColors[t.type] || borderColors.info
            }`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 font-mono text-xs">
              {t.title && (
                <div className="font-bold uppercase tracking-wider text-[10px] text-white">
                  {t.title}
                </div>
              )}
              <div className="text-white/90 text-xs mt-0.5 font-sans leading-snug">
                {t.message}
              </div>
              <div className="text-[9px] text-white/50 mt-1">{t.timestamp}</div>
            </div>

            <button
              type="button"
              onClick={() => handleDismiss(t.id)}
              className="text-white/50 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export { ToastContainer };
