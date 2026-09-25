import { useState, useEffect } from "react";
import { api } from "./services/api";
import { dashboardSocket, simulationSocket } from "./services/websocket";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { ApprovalModal } from "./components/missions/ApprovalModal";
import { AlertCenterDrawer } from "./components/common/AlertCenterDrawer";
import { CinematicIntro } from "./components/common/CinematicIntro";
import { PageTransition } from "./components/common/PageTransition";
import { ToastContainer } from "./components/common/ToastContainer";
import { toast } from "./utils/toast";

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
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !localStorage.getItem("resqai_intro_seen");
    } catch {
      return false;
    }
  });

  const [timelineEvents, setTimelineEvents] = useState([
    { time: "12:40", event: "Flood telemetry detected at Mahanadi delta gauge (+1.8m above danger mark)", type: "INFO" },
    { time: "12:41", event: "Zone 4 Cuttack Outer Sector classified as HIGH risk", type: "WARNING" },
    { time: "12:42", event: "Road R-17 washed out; secondary canal waterway activated", type: "CRITICAL" },
    { time: "12:43", event: "14 possible victims detected in Zone 7 Erasama coastal basin", type: "CRITICAL" },
    { time: "12:44", event: "AI response proposal generated: Dispatch RESCUE-04 to Zone 7 (Pending Human Approval)", type: "DECISION" },
    { time: "12:45", event: "Alternative watercraft route R-18 calculated (ETA 11 min)", type: "INFO" },
    { time: "12:46", event: "SCB Medical College pre-staged 34 trauma beds for incoming evacuees", type: "INFO" }
  ]);

  // Keyboard shortcut for Focus Mode (Ctrl/Cmd + Shift + F) - Section 62
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        setFocusMode((prev) => {
          const next = !prev;
          setSidebarCollapsed(next);
          toast.info(next ? "Focus Mode Active: Map expanded, sidebar minimized." : "Focus Mode Deactivated: Standard layout restored.", "FOCUS TOGGLE");
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      const updatedMissions = summary.active_missions.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: "APPROVED",
              approved_by: officerName,
              approved_at: new Date().toTimeString().slice(0, 8)
            }
          : m
      );
      setSummary({ ...summary, active_missions: updatedMissions });
      setTimelineEvents((prev) => [
        ...prev,
        {
          time: new Date().toTimeString().slice(0, 5),
          event: `Human Authorization: Mission ${missionId} approved by ${officerName}. Rescue teams dispatched.`,
          type: "DECISION"
        }
      ]);

      toast.success(
        `Mission ${missionId} authorized by ${officerName}. Rescue Team 04 dispatched to Zone 7.`,
        "MISSION APPROVED"
      );
    }
  };

  const handleRejectMission = async (missionId, reason) => {
    await api.rejectMission(missionId, reason);
    if (summary) {
      const updatedMissions = summary.active_missions.map((m) =>
        m.id === missionId ? { ...m, status: "REJECTED", rejection_reason: reason } : m
      );
      setSummary({ ...summary, active_missions: updatedMissions });
      toast.warning(`Mission ${missionId} rejected: ${reason}`, "MISSION REJECTED");
    }
  };

  const handleStartSimulation = async (speed) => {
    setSimulationRunning(true);
    await api.startSimulation(speed);
    toast.info(`Cat-4 Flood Inundation Simulation initiated at ${speed}× speed.`, "SIMULATION STARTED");
  };

  const handlePauseSimulation = async () => {
    setSimulationRunning(false);
    await api.pauseSimulation();
    toast.info("Simulation paused.", "SIMULATION PAUSED");
  };

  const handleResetSimulation = async () => {
    setSimulationRunning(false);
    setSimulationStep(0);
    const res = await api.resetSimulation();
    if (res.summary) {
      setSummary(res.summary);
    }
    toast.info("Simulation telemetry reset to baseline state.", "SIMULATION RESET");
  };

  if (!summary) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider text-slate-300">
            CONNECTING TO RESQAI COMMAND TELEMETRY...
          </span>
        </div>
      </div>
    );
  }

  const pendingCount = summary.active_missions?.filter((m) => m.status === "PENDING_APPROVAL").length || 0;
  const criticalIncidentsCount = summary.recent_incidents?.filter((i) => i.priority === "P1").length || 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050505] text-[#FFFFFF] flex flex-col font-sans selection:bg-red-500/30 selection:text-white">
      {/* Toast Layer (Section 37) */}
      <ToastContainer />

      {/* Cinematic Opening Video Experience (Section 6 & 57) */}
      {showIntro && (
        <CinematicIntro onEnter={() => setShowIntro(false)} />
      )}

      {/* Top Telemetry & Status Navbar (Fixed at top) */}
      <div className="shrink-0 z-40 w-full">
        <Navbar
          disaster={summary.disaster}
          activeSimulationStep={simulationStep}
          simulationRunning={simulationRunning}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          unreadAlertsCount={3}
          onOpenIntro={() => setShowIntro(true)}
        />
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        {/* Left Operational Sidebar (Fixed at left) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          pendingMissionsCount={pendingCount}
          criticalIncidentsCount={criticalIncidentsCount}
          offlineQueueCount={7}
          collapsed={sidebarCollapsed || focusMode}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          focusMode={focusMode}
          onToggleFocusMode={() => {
            const next = !focusMode;
            setFocusMode(next);
            setSidebarCollapsed(next);
          }}
        />

        {/* Main Work Area (Only this area scrolls) */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 bg-[#050505] scroll-smooth overscroll-contain">
          <PageTransition pageKey={currentTab}>
            {currentTab === "dashboard" && (
              <DashboardPage
                summary={summary}
                onOpenMissionApproval={(mission) => setSelectedMissionForApproval(mission)}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === "map" && (
              <MapPage
                zones={summary.zones}
                incidents={summary.recent_incidents}
                roads={summary.roads || []}
                hospitals={summary.hospitals || []}
                shelters={summary.shelters || []}
                rescueTeams={summary.rescue_teams || []}
              />
            )}

            {currentTab === "incidents" && (
              <IncidentsPage
                incidents={summary.recent_incidents}
                timelineEvents={timelineEvents}
                onOpenApproval={(mission) => setSelectedMissionForApproval(mission)}
              />
            )}

            {currentTab === "missions" && (
              <MissionsPage
                missions={summary.active_missions}
                onOpenApproval={(mission) => setSelectedMissionForApproval(mission)}
                onRejectMission={handleRejectMission}
              />
            )}

            {currentTab === "resources" && (
              <ResourcesPage
                rescueTeams={summary.rescue_teams || []}
                shelters={summary.shelters || []}
                hospitals={summary.hospitals || []}
                ambulances={summary.ambulances || []}
              />
            )}

            {currentTab === "analytics" && (
              <AnalyticsPage summary={summary} />
            )}

            {currentTab === "copilot" && (
              <CopilotPage
                onOpenMissionApproval={(mission) => setSelectedMissionForApproval(mission)}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === "reports" && (
              <ReportsPage summary={summary} />
            )}

            {currentTab === "simulation" && (
              <SimulationPage
                running={simulationRunning}
                step={simulationStep}
                maxSteps={7}
                speed={1}
                onStart={handleStartSimulation}
                onPause={handlePauseSimulation}
                onReset={handleResetSimulation}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === "citizen-report" && (
              <CitizenReportPage />
            )}

            {currentTab === "mobile-response" && (
              <MobileResponsePage missions={summary.active_missions} />
            )}

            {currentTab === "settings" && (
              <SettingsPage onReplayIntro={() => setShowIntro(true)} />
            )}
          </PageTransition>
        </main>
      </div>

      {/* Human-in-the-Loop Mission Authorization Modal (Section 18) */}
      {selectedMissionForApproval && (
        <ApprovalModal
          mission={selectedMissionForApproval}
          isOpen={!!selectedMissionForApproval}
          onClose={() => setSelectedMissionForApproval(null)}
          onApprove={handleApproveMission}
          onReject={handleRejectMission}
        />
      )}

      {/* Live Alert Center Drawer (Section 21) */}
      <AlertCenterDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectAlert={(tab) => {
          setCurrentTab(tab);
          setIsAlertsOpen(false);
        }}
      />
    </div>
  );
}

export default App;
