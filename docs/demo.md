# DISASTERIQ — 3-Minute Hackathon Demo Script (SIH Ready)

## Setup
1. Backend running: `http://localhost:8000`
2. Frontend running: `http://localhost:5173`
3. Browser open to: `/dashboard`

---

## 3-Minute Live Presentation Walkthrough

### Scene 1: Command Center Overview (0:00 - 0:30)
- **Presenter says:**
  > *"DisasterIQ converts fragmented multi-source disaster data into intelligent, explainable emergency action. Here is our live EOC command center, monitoring a catastrophic cyclone-induced flood across the Odisha coastal delta."*
- **Action on screen:**
  - Show the dark tactical NASA-style interface with real-time statistics (295,300 affected citizens, 8 hazard zones, 24 response teams).
  - Point to the live interactive GIS map with real-time telemetry.

### Scene 2: Live Simulation Trigger (0:30 - 0:50)
- **Presenter says:**
  > *"Rather than static mockups, DisasterIQ runs a deterministic real-time simulation engine that orchestrates the entire operational workflow."*
- **Action on screen:**
  - Navigate to **Simulation** tab.
  - Click **START SIMULATION** at speed $\times 2$.
  - Watch the live step-by-step progress bar increment as upstream reservoir gates open and water levels rise.

### Scene 3: AI Vision & Risk Classification (0:50 - 1:20)
- **Presenter says:**
  > *"As flood stage reaches 3.4 meters, our computer vision detector analyzes drone aerial footage, identifying 14 individuals stranded on an inundated school rooftop in Zone 7. The risk engine immediately elevates Zone 7 to CRITICAL with a score of 93/100, citing road washout and rapid water velocity."*
- **Action on screen:**
  - Navigate to **Live GIS Map**.
  - Click on the pulsing red polygon of **Zone 7 (Erasama)** to reveal the telemetry inspector, flood depth, and contributing risk factors.
  - Show the red dashed line for washed-out road **R-17**.

### Scene 4: Copilot Operational Querying (1:20 - 1:50)
- **Presenter says:**
  > *"An incident commander doesn't have time to dig through spreadsheets. They ask DisasterIQ Copilot."*
- **Action on screen:**
  - Navigate to **DisasterIQ Copilot**.
  - Click sample prompt: *"Which zone should response teams prioritize?"*
  - Watch the Copilot execute `get_critical_zones()` tool call, cite NDMA SOP Section 4.2 for rooftop rescues, and recommend deploying **RESCUE-04** via canal route **R-18**.

### Scene 5: Human-in-the-Loop Mission Authorization (1:50 - 2:20)
- **Presenter says:**
  > *"DisasterIQ is strictly an operational decision-support system. High-impact emergency deployments are NEVER performed autonomously by AI."*
- **Action on screen:**
  - Navigate to **Missions & Approvals** (or the red banner on Dashboard).
  - Open the **Human-in-the-Loop** modal for Mission `MIS-801`.
  - Review the explainable rationale, enter Commander credentials, and click **APPROVE MISSION**.
  - Mission status flips to `APPROVED` and team `RESCUE-04` is dispatched in real time.

### Scene 6: Field Responder HUD & Incident Resolution (2:20 - 2:45)
- **Presenter says:**
  > *"Field teams on motorized Zodiac boats receive the mission on their Responder HUD."*
- **Action on screen:**
  - Open **Responder Mobile** view.
  - Tap **ARRIVED ON SCENE** and **RESOLVED**.
  - Show the victim count drop to zero.

### Scene 7: Situation Report Generation (2:45 - 3:00)
- **Presenter says:**
  > *"Within seconds, DisasterIQ synthesizes an official ICS-compliant Situation Report, strictly delineating Observed Telemetry, AI Analysis, and Approved Actions."*
- **Action on screen:**
  - Click **Situation Reports** to show the printable document.
  - End with tagline:
  > *"DISASTERIQ — From disaster data to intelligent action."*
