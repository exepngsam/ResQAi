import { useState, useEffect } from "react";
import { api } from "./services/api";
import { dashboardSocket, simulationSocket } from "./services/websocket";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { ApprovalModal } from "./components/missions/ApprovalModal";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { MissionsPage } from "./pages/MissionsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CopilotPage } from "./pages/CopilotPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SimulationPage } from "./pages/SimulationPage";
import { CitizenReportPage } from "./pages/CitizenReportPage";
import { MobileResponsePage } from "./pages/MobileResponsePage";
import { SettingsPage } from "./pages/SettingsPage";
function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [summary, setSummary] = useState(null);
  const [selectedMissionForApproval, setSelectedMissionForApproval] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [timelineEvents, setTimelineEvents] = useState([
    { time: "12:40", event: "Flood telemetry detected at Mahanadi delta gauge (+1.8m above danger mark)", type: "INFO" },
    { time: "12:41", event: "Zone 4 Cuttack Outer Sector classified as HIGH risk", type: "WARNING" },
    { time: "12:42", event: "Road R-17 washed out; secondary canal waterway activated", type: "CRITICAL" },
    { time: "12:43", event: "14 possible victims detected in Zone 7 Erasama coastal basin", type: "CRITICAL" },
    { time: "12:44", event: "AI response proposal generated: Dispatch RESCUE-04 to Zone 7 (Pending Human Approval)", type: "DECISION" },
    { time: "12:45", event: "Alternative watercraft route R-18 calculated (ETA 11 min)", type: "INFO" },
    { time: "12:46", event: "SCB Medical College pre-staged 34 trauma beds for incoming evacuees", type: "INFO" }
  ]);
  useEffect(() => {
    const load = async () => {
      const data = await api.getDashboardSummary();
      setSummary(data);
      if (data.simulation_state) {
        setSimulationRunning(data.simulation_state.running);
        setSimulationStep(data.simulation_state.step);
      }
    };
    load();
    dashboardSocket.connect();
    simulationSocket.connect();
    const unsubDashboard = dashboardSocket.subscribe((msg) => {
      if (msg.type === "INIT_STATE" && msg.data) {
        setSummary(msg.data);
      } else if (msg.disaster) {
        setSummary(msg);
      }
    });
    const unsubSim = simulationSocket.subscribe((msg) => {
      if (msg.type === "SIMULATION_TICK") {
        setSimulationStep(msg.step);
        setSimulationRunning(msg.running);
        if (msg.events && msg.events.length > 0) {
          setTimelineEvents((prev) => [...prev, ...msg.events]);
        }
        if (msg.summary) {
          setSummary(msg.summary);
        }
      }
    });
    return () => {
      unsubDashboard();
      unsubSim();
      dashboardSocket.disconnect();
      simulationSocket.disconnect();
    };
  }, []);
  const handleApproveMission = async (missionId, officerName) => {
    await api.approveMission(missionId, officerName);
    if (summary) {
      const updatedMissions = summary.active_missions.map(
        (m) => m.id === missionId ? {
          ...m,
          status: "APPROVED",
          approved_by: officerName,
          approved_at: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8)
        } : m
      );
      setSummary({ ...summary, active_missions: updatedMissions });
      setTimelineEvents((prev) => [
        ...prev,
        {
          time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
          event: `Human Authorization: Mission ${missionId} approved by ${officerName}. Rescue teams dispatched.`,
          type: "DECISION"
        }
      ]);
    }
  };
  const handleRejectMission = async (missionId, reason) => {
    await api.rejectMission(missionId, reason);
    if (summary) {
      const updatedMissions = summary.active_missions.map(
        (m) => m.id === missionId ? { ...m, status: "REJECTED", rejection_reason: reason } : m
      );
      setSummary({ ...summary, active_missions: updatedMissions });
    }
  };
  const handleStartSimulation = async (speed) => {
    setSimulationRunning(true);
    await api.startSimulation(speed);
  };
  const handlePauseSimulation = async () => {
    setSimulationRunning(false);
    await api.pauseSimulation();
  };
  const handleResetSimulation = async () => {
    setSimulationRunning(false);
    setSimulationStep(0);
    const res = await api.resetSimulation();
    if (res.summary) {
      setSummary(res.summary);
    }
  };
  if (!summary) {
    return <div className="min-h-screen bg-command-bg flex items-center justify-center font-mono text-cyan-400"><div className="flex flex-col items-center gap-3"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /><span className="text-sm font-bold tracking-wider">INITIALIZING DISASTERIQ COMMAND TELEMETRY...</span></div></div>;
  }
  const pendingCount = summary.active_missions.filter((m) => m.status === "PENDING_APPROVAL").length;
  const criticalIncidentsCount = summary.recent_incidents.filter((i) => i.priority === "P1").length;
  return <div className="min-h-screen bg-command-bg text-slate-100 flex flex-col font-sans">{
    /* Top Telemetry & Status Navbar */
  }<Navbar
    disaster={summary.disaster}
    activeSimulationStep={simulationStep}
    simulationRunning={simulationRunning}
  /><div className="flex-1 flex overflow-hidden">{
    /* Left Operational Sidebar */
  }<Sidebar
    currentTab={currentTab}
    onTabChange={(tab) => setCurrentTab(tab)}
    pendingMissionsCount={pendingCount}
    criticalIncidentsCount={criticalIncidentsCount}
    offlineQueueCount={7}
  />{
    /* Main Work Area */
  }<main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#070d16]/95">{currentTab === "dashboard" && <DashboardPage
    summary={summary}
    onOpenMissionApproval={(mission) => setSelectedMissionForApproval(mission)}
    onNavigate={(tab) => setCurrentTab(tab)}
  />}{currentTab === "map" && <MapPage
    zones={summary.zones}
    incidents={summary.recent_incidents}
  />}{currentTab === "incidents" && <IncidentsPage
    incidents={summary.recent_incidents}
    timelineEvents={timelineEvents}
  />}{currentTab === "missions" && <MissionsPage
    missions={summary.active_missions}
    onOpenApproval={(mission) => setSelectedMissionForApproval(mission)}
    onRejectMission={handleRejectMission}
  />}{currentTab === "resources" && <ResourcesPage
    rescueTeams={summary.zones ? void 0 : []}
  />}{currentTab === "analytics" && <AnalyticsPage summary={summary} />}{currentTab === "copilot" && <CopilotPage />}{currentTab === "reports" && <ReportsPage summary={summary} />}{currentTab === "simulation" && <SimulationPage
    running={simulationRunning}
    step={simulationStep}
    maxSteps={7}
    speed={1}
    onStart={handleStartSimulation}
    onPause={handlePauseSimulation}
    onReset={handleResetSimulation}
    onNavigate={(tab) => setCurrentTab(tab)}
  />}{currentTab === "citizen-report" && <CitizenReportPage />}{currentTab === "mobile-response" && <MobileResponsePage missions={summary.active_missions} />}{currentTab === "settings" && <SettingsPage />}</main></div>{
    /* Human-in-the-Loop Authorization Modal */
  }{selectedMissionForApproval && <ApprovalModal
    mission={selectedMissionForApproval}
    isOpen={!!selectedMissionForApproval}
    onClose={() => setSelectedMissionForApproval(null)}
    onApprove={handleApproveMission}
    onReject={handleRejectMission}
  />}</div>;
}
export {
  App as default
};
