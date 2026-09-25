import { FileText, Printer } from "lucide-react";
const ReportsPage = ({ summary }) => {
  const handlePrint = () => {
    window.print();
  };
  return <div className="space-y-6 max-w-4xl mx-auto">{
    /* Action Header */
  }<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-command-border"><div><h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-400" /><span>AI Automated Situation Report (SITREP)</span></h2><p className="text-xs text-slate-400 font-mono mt-0.5">
            Compliant with NDMA Incident Command System (ICS Form 201).
          </p></div><div className="flex items-center gap-2"><button
    type="button"
    onClick={handlePrint}
    className="px-4 py-2 rounded-lg bg-command-bg hover:bg-command-hover text-white text-xs font-mono border border-command-border flex items-center gap-2 transition-colors cursor-pointer"
  ><Printer className="w-3.5 h-3.5" />
            PRINT / PDF
          </button></div></div>{
    /* Structured Situation Report Document */
  }<div className="p-8 rounded-2xl bg-command-panel border border-command-border shadow-2xl text-slate-200 font-mono text-xs space-y-6">{
    /* Document Header */
  }<div className="border-b border-slate-700 pb-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-red-500 tracking-widest uppercase">
              GOVERNMENT OF ODISHA — DISASTER MANAGEMENT AUTHORITY
            </span><span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/50 font-bold">
              CLASSIFICATION: CRITICAL EMERGENCY
            </span></div><h1 className="text-xl font-bold text-white tracking-tight mt-2">
            INCIDENT SITUATION REPORT: {summary.disaster.name}</h1><div className="mt-1 text-slate-400 text-[11px] flex gap-6"><span>Disaster ID: {summary.disaster.id}</span><span>Origin Epoch: {summary.disaster.started_at}</span><span>Generated: {(/* @__PURE__ */ new Date()).toUTCString()}</span></div></div>{
    /* Section 1: OBSERVED DATA */
  }<div><h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400" /><span>1. OBSERVED SENSOR &amp; RECONNAISSANCE DATA</span></h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div className="p-3 bg-command-bg rounded-lg border border-slate-800"><div className="text-slate-400 text-[10px]">AFFECTED POPULATION</div><div className="text-base font-bold text-white mt-0.5">{summary.total_affected_population.toLocaleString()}</div></div><div className="p-3 bg-command-bg rounded-lg border border-slate-800"><div className="text-slate-400 text-[10px]">CRITICAL ZONES</div><div className="text-base font-bold text-red-400 mt-0.5">{summary.critical_zones_count} of 8 zones</div></div><div className="p-3 bg-command-bg rounded-lg border border-slate-800"><div className="text-slate-400 text-[10px]">POSSIBLE TRAPPED VICTIMS</div><div className="text-base font-bold text-amber-400 mt-0.5">{summary.detected_victims_count} civilians</div></div><div className="p-3 bg-command-bg rounded-lg border border-slate-800"><div className="text-slate-400 text-[10px]">IMPASSABLE ROADS</div><div className="text-base font-bold text-white mt-0.5">{summary.blocked_roads_count} corridors</div></div></div></div>{
    /* Section 2: AI SITUATIONAL ANALYSIS */
  }<div><h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>2. AI SYNTHESIZED SITUATIONAL ANALYSIS</span></h3><div className="p-4 bg-command-bg rounded-xl border border-slate-800 leading-relaxed space-y-2 text-slate-300"><p>
              • <strong>Hydrological Threat:</strong> Extreme discharge from Naraj and Mahanadi barrages combined with high tidal backflow has submerged coastal lowlands across Kendrapara and Jagatsinghpur.
            </p><p>
              • <strong>Isolation Vectors:</strong> Road R-17 has suffered complete structural scouring over 4.2 km. Erasama primary school rooftop holds 14 trapped individuals in Zone 7. Water velocity is clocked at 2.4 m/s.
            </p><p>
              • <strong>Urban Choke Points:</strong> Cuttack Outer Suburbs (Zone 4) has experienced severe storm sewer backflow endangering an elderly care facility (Incident INC-792).
            </p></div></div>{
    /* Section 3: RECOMMENDATIONS */
  }<div><h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span>3. ACTIONABLE RESPONSE RECOMMENDATIONS (DECISION-SUPPORT)</span></h3><div className="space-y-2.5">{[
    {
      step: "1",
      action: "Immediate Mission Dispatch to Zone 7",
      detail: "Authorize RESCUE-04 deployment via Canal Route R-18 with 4 inflatable Zodiac boats and pediatric medical kit."
    },
    {
      step: "2",
      action: "Corridor Traffic Redirection",
      detail: "Close flooded State Highway SH-12 (R-04) to civilian transit; establish dedicated emergency supply green corridor via NH-16 bypass."
    },
    {
      step: "3",
      action: "Hospital Surge Readiness",
      detail: "Direct SCB Medical College and AIIMS Bhubaneswar to hold 62 critical trauma and hypothermia ICU beds on standby."
    },
    {
      step: "4",
      action: "Humanitarian Shelter Reallocation",
      detail: "Redirect arriving evacuees from Erasama Bunker (84% capacity) to Jagatsinghpur Center before potable water reserves drop below 72h buffer."
    }
  ].map((rec) => <div key={rec.step} className="p-3 bg-command-bg rounded-lg border border-slate-800 flex items-start gap-3"><span className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold shrink-0">{rec.step}</span><div><div className="font-bold text-white">{rec.action}</div><div className="text-slate-400 text-[11px] mt-0.5">{rec.detail}</div></div></div>)}</div></div>{
    /* Footer Notice */
  }<div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center"><span>DISASTERIQ VERSION 1.0 — FOR OFFICIAL EOC USE ONLY</span><span>HUMAN APPROVAL REQUIRED PRIOR TO OPERATIONAL DISPATCH</span></div></div></div>;
};
export {
  ReportsPage
};
