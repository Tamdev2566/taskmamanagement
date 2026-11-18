import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const tasksToAnalyze = [
  {
    id: "TSK-104",
    title: "Sprint Backlog & Hierarchy Tree",
    tag: "Backlog",
    tagColor: "#3b82f6",
    duration: 600,
  },
  {
    id: "TSK-108",
    title: "Dev & QA Lifecycle Tracking Matrix",
    tag: "Lifecycle",
    tagColor: "#8b5cf6",
    duration: 1200,
  },
  {
    id: "TSK-112",
    title: "Real-time Burndown & Velocity Metrics",
    tag: "Analytics",
    tagColor: "#f59e0b",
    duration: 1900,
  },
  {
    id: "TSK-116",
    title: "Role Permissions & Workspace Sync",
    tag: "Governance",
    tagColor: "#10b981",
    duration: 2500,
  },
];

const statusMessages = [
  "Initializing Sprint Intelligence Engine...",
  "Scanning active sprint tasks & dependency tree...",
  "Evaluating developer & QA lifecycle status...",
  "Calculating velocity metrics & burndown rate...",
  "Synchronizing workspace telemetry... Ready!",
];

const Loader = ({ title = "Task Intelligence Engine" }) => {
  const [progress, setProgress] = useState(12);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [analyzingTaskIndex, setAnalyzingTaskIndex] = useState(0);

  useEffect(() => {
    // Progress counter (0 to 100%)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 6) + 3;
        return Math.min(prev + increment, 99);
      });
    }, 120);

    // Status message cycler
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < statusMessages.length - 1 ? prev + 1 : prev));
    }, 600);

    // Sequential task completion simulation
    const taskTimeouts = tasksToAnalyze.map((task, idx) => {
      return setTimeout(() => {
        setCompletedTasks((prev) => [...prev, task.id]);
        setAnalyzingTaskIndex(idx + 1);
      }, task.duration);
    });

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      taskTimeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <OverlayContainer>
      {/* Background Animated Cyber Ambient Grid */}
      <BackgroundGrid />
      <AmbientGlow1 />
      <AmbientGlow2 />

      <LoaderCard>
        {/* Top Header with Live Beacon */}
        <CardHeader>
          <BrandBadge>
            <LiveBeacon />
            <span>REAL-TIME TASK ANALYZER</span>
          </BrandBadge>
          <LatencyBadge>
            <FlashOnIcon sx={{ fontSize: 13, color: "#10b981" }} />
            <span>LIVE SYNC • 12ms</span>
          </LatencyBadge>
        </CardHeader>

        {/* Center Holographic Task Radar & Scanner */}
        <RadarSection>
          <RadarOuterRing>
            <RadarSweep />
            <RadarMidRing />
            <RadarInnerRing>
              <CenterCoreIcon>
                <AnalyticsIcon sx={{ fontSize: 34, color: "#ffffff" }} />
              </CenterCoreIcon>
            </RadarInnerRing>

            {/* Orbiting Task Node Pins */}
            <OrbitalNode className="node-1" $color="#3b82f6" title="Backlog" />
            <OrbitalNode className="node-2" $color="#8b5cf6" title="In Progress" />
            <OrbitalNode className="node-3" $color="#f59e0b" title="QA Review" />
            <OrbitalNode className="node-4" $color="#10b981" title="Done" />
          </RadarOuterRing>

          {/* Real-time Status Caption */}
          <StatusTextWrapper>
            <StatusTitle>{statusMessages[currentStep]}</StatusTitle>
            <StatusSubtitle>
              Scanning workspace backlogs, developer logs, and QA lifecycle pipelines
            </StatusSubtitle>
          </StatusTextWrapper>
        </RadarSection>

        {/* Live Task Analysis Stream / Checklist */}
        <TaskListContainer>
          <TaskListHeader>
            <span>LIVE TASK PIPELINE</span>
            <span className="count">
              {completedTasks.length} / {tasksToAnalyze.length} ANALYZED
            </span>
          </TaskListHeader>

          {tasksToAnalyze.map((task, index) => {
            const isDone = completedTasks.includes(task.id);
            const isAnalyzing = analyzingTaskIndex === index && !isDone;

            return (
              <TaskItem key={task.id} $isDone={isDone} $isAnalyzing={isAnalyzing}>
                <div className="left-meta">
                  <div className="icon-wrapper">
                    {isDone ? (
                      <CheckCircleIcon sx={{ fontSize: 18, color: "#10b981" }} />
                    ) : isAnalyzing ? (
                      <SpinnerIcon />
                    ) : (
                      <span className="dot" />
                    )}
                  </div>
                  <div className="task-info">
                    <span className="task-id">{task.id}</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                </div>

                <div className="right-meta">
                  <TagBadge $bg={task.tagColor}>{task.tag}</TagBadge>
                  <StatusBadge $isDone={isDone} $isAnalyzing={isAnalyzing}>
                    {isDone ? "VERIFIED" : isAnalyzing ? "ANALYZING..." : "QUEUED"}
                  </StatusBadge>
                </div>

                {isAnalyzing && <ScanLaser />}
              </TaskItem>
            );
          })}
        </TaskListContainer>

        {/* Progress Bar & Telemetry Footer */}
        <FooterSection>
          <ProgressInfo>
            <span className="label">ANALYSIS PROGRESS</span>
            <span className="percentage">{progress}%</span>
          </ProgressInfo>
          <ProgressBarTrack>
            <ProgressBarFill $width={progress} />
          </ProgressBarTrack>

          <MetricsRow>
            <MetricItem>
              <span className="num">48</span>
              <span className="desc">Active Tasks</span>
            </MetricItem>
            <Divider />
            <MetricItem>
              <span className="num">100%</span>
              <span className="desc">Sprint Velocity</span>
            </MetricItem>
            <Divider />
            <MetricItem>
              <span className="num">0.02s</span>
              <span className="desc">Latency</span>
            </MetricItem>
            <Divider />
            <MetricItem>
              <span className="num status-healthy">HEALTHY</span>
              <span className="desc">Engine Status</span>
            </MetricItem>
          </MetricsRow>
        </FooterSection>
      </LoaderCard>
    </OverlayContainer>
  );
};

// ==================== STYLES & ANIMATIONS ====================

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.08); }
`;

const radarRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const laserSweep = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #0f172a 0%, #090d16 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  user-select: none;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

const AmbientGlow1 = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  top: 15%;
  left: 20%;
  filter: blur(80px);
  animation: ${pulse} 6s ease-in-out infinite alternate;
`;

const AmbientGlow2 = styled.div`
  position: absolute;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
  bottom: 10%;
  right: 20%;
  filter: blur(80px);
  animation: ${pulse} 7s ease-in-out infinite alternate-reverse;
`;

const LoaderCard = styled.div`
  position: relative;
  z-index: 10;
  width: 92%;
  max-width: 540px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 
    0 25px 60px -15px rgba(0, 0, 0, 0.7),
    0 0 40px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const BrandBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #c7d2fe;
`;

const LiveBeacon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const LatencyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #34d399;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
`;

const RadarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 6px 0 2px;
`;

const RadarOuterRing = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1.5px dashed rgba(99, 102, 241, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.12);
`;

const RadarMidRing = styled.div`
  position: absolute;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 1px solid rgba(168, 85, 247, 0.25);
`;

const RadarInnerRing = styled.div`
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  z-index: 2;
`;

const CenterCoreIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RadarSweep = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.35) 0deg, transparent 60deg, transparent 360deg);
  animation: ${radarRotate} 2s linear infinite;
  pointer-events: none;
`;

const OrbitalNode = styled.div`
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  box-shadow: 0 0 10px ${(props) => props.$color};

  &.node-1 { top: 6px; left: 52px; animation: ${pulse} 1.8s infinite; }
  &.node-2 { right: 8px; top: 48px; animation: ${pulse} 2.1s infinite 0.3s; }
  &.node-3 { bottom: 8px; left: 62px; animation: ${pulse} 1.9s infinite 0.6s; }
  &.node-4 { left: 8px; top: 44px; animation: ${pulse} 2.3s infinite 0.9s; }
`;

const StatusTextWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatusTitle = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: all 0.3s ease;
`;

const StatusSubtitle = styled.div`
  color: #94a3b8;
  font-size: 11.5px;
  max-width: 380px;
  line-height: 1.4;
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  background: rgba(10, 15, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 12px 14px;
`;

const TaskListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.08em;
  margin-bottom: 2px;

  .count {
    color: #818cf8;
  }
`;

const TaskItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 8px;
  background: ${(props) =>
    props.$isAnalyzing
      ? "rgba(99, 102, 241, 0.12)"
      : props.$isDone
      ? "rgba(16, 185, 129, 0.06)"
      : "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${(props) =>
      props.$isAnalyzing
        ? "rgba(99, 102, 241, 0.3)"
        : props.$isDone
        ? "rgba(16, 185, 129, 0.2)"
        : "rgba(255, 255, 255, 0.04)"};
  overflow: hidden;
  transition: all 0.25s ease;

  .left-meta {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #475569;
    }
  }

  .task-info {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .task-id {
    font-size: 11px;
    font-weight: 800;
    color: #818cf8;
    letter-spacing: 0.02em;
  }

  .task-title {
    font-size: 12px;
    font-weight: 600;
    color: ${(props) => (props.$isDone ? "#e2e8f0" : "#94a3b8")};
  }

  .right-meta {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const SpinnerIcon = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ScanLaser = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.15) 50%,
    transparent 100%
  );
  animation: ${laserSweep} 1.2s infinite ease-in-out;
  pointer-events: none;
`;

const TagBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(props) => `${props.$bg}20`};
  color: ${(props) => props.$bg};
  border: 1px solid ${(props) => `${props.$bg}40`};
`;

const StatusBadge = styled.span`
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: ${(props) =>
    props.$isDone ? "#34d399" : props.$isAnalyzing ? "#818cf8" : "#64748b"};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 10px;
    font-weight: 800;
    color: #64748b;
    letter-spacing: 0.08em;
  }

  .percentage {
    font-size: 14px;
    font-weight: 850;
    color: #a5b4fc;
    font-variant-numeric: tabular-nums;
  }
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #10b981 100%);
  border-radius: 10px;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
`;

const MetricsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .num {
    font-size: 12px;
    font-weight: 800;
    color: #f8fafc;
    font-variant-numeric: tabular-nums;

    &.status-healthy {
      color: #34d399;
      font-size: 11px;
    }
  }

  .desc {
    font-size: 9.5px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
`;

export default Loader;
