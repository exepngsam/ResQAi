import { useState } from "react";
import { Bot, Send, Sparkles, BookOpen, Terminal } from "lucide-react";
import { api } from "../services/api";
const CopilotPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Greetings Commander. I am **DisasterIQ Copilot**, your operational tactical assistant. I query real-time GIS data, telemetry feeds, and NDMA standard operating procedures to assist in decision-support.\n\nHow can I support rescue operations today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sampleQueries = [
    "Which zone should response teams prioritize?",
    "Find blocked roads near hospitals.",
    "Which rescue team is closest to Zone 7?",
    "Generate an emergency situation report."
  ];
  const handleSend = async (queryText) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;
    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await api.queryCopilot(q);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          tool_calls: response.tool_calls,
          sources: response.sources
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to intelligence copilot service. Operating in offline cached fallback."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  return <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-command-panel border border-command-border rounded-xl overflow-hidden shadow-2xl">{
    /* Header */
  }<div className="p-4 border-b border-command-border flex items-center justify-between bg-command-bg/40"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/80 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/40"><Bot className="w-5 h-5 animate-pulse" /></div><div><h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><span>DISASTERIQ COPILOT</span><span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold">
                RAG + TOOL EXECUTION
              </span></h2><div className="text-[11px] text-slate-400 font-mono">
              Grounded in live telemetry &amp; NDMA/NDRF guidelines with explicit citations.
            </div></div></div></div>{
    /* Message Stream */
  }<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">{messages.map((msg, i) => <div
    key={i}
    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
  ><div
    className={`max-w-2xl rounded-xl p-4 font-mono text-xs leading-relaxed ${msg.role === "user" ? "bg-red-950/80 text-white border border-red-500/40" : "bg-command-card text-slate-200 border border-command-border shadow-lg"}`}
  ><div className="whitespace-pre-wrap">{msg.content}</div>{
    /* Tool Execution Badges */
  }{msg.tool_calls && msg.tool_calls.length > 0 && <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] space-y-1"><div className="text-cyan-400 flex items-center gap-1 font-bold"><Terminal className="w-3 h-3" /><span>Tool Invocations Verified:</span></div>{msg.tool_calls.map((t, idx) => <div key={idx} className="text-slate-400 pl-4">
                      • <code className="text-amber-400 font-bold">{t.tool}()</code> executed against platform store
                    </div>)}</div>}{
    /* RAG Knowledge Citations */
  }{msg.sources && msg.sources.length > 0 && <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] space-y-1"><div className="text-emerald-400 flex items-center gap-1 font-bold"><BookOpen className="w-3 h-3" /><span>Verified Knowledge Citations:</span></div>{msg.sources.map((s, idx) => <div key={idx} className="text-slate-400 pl-4">
                      [{s.id}] {s.source} — <em className="text-slate-300 font-sans">{s.title}</em></div>)}</div>}</div></div>)}{loading && <div className="flex justify-start"><div className="p-3 rounded-xl bg-command-card border border-command-border text-xs font-mono text-cyan-400 flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /><span>Querying platform telemetry &amp; synthesizing decision plan...</span></div></div>}</div>{
    /* Suggested Prompt Chips */
  }<div className="px-4 py-2 bg-command-bg border-t border-command-border flex items-center gap-2 overflow-x-auto"><span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Quick Queries:</span>{sampleQueries.map((q, i) => <button
    key={i}
    type="button"
    onClick={() => handleSend(q)}
    className="text-[11px] font-mono px-2.5 py-1 rounded bg-command-panel hover:bg-command-hover text-slate-300 border border-command-border shrink-0 transition-colors cursor-pointer"
  >{q}</button>)}</div>{
    /* Input Box */
  }<div className="p-3 bg-command-panel border-t border-command-border flex items-center gap-2"><input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
    placeholder="Ask Copilot about zones, rescue teams, road blockages, or operational protocols..."
    className="flex-1 bg-command-bg border border-command-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
  /><button
    type="button"
    onClick={() => handleSend()}
    disabled={loading || !input.trim()}
    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50"
  ><Send className="w-3.5 h-3.5" /><span>SEND</span></button></div></div>;
};
export {
  CopilotPage
};
