import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  CheckCircle,
  Code,
  Science,
  RocketLaunch,
  AccessTime,
  HourglassBottom,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectUser, selectEmployee } from "../globalData/authSlice";
import apiService from "./services/apiServices";

const steps = [
  "Assigned",
  "Work In Progress",
  "Development Completed",
  "Testing Assigned",
  "Testing In Progress",
  "Testing Completed",
  "Closed",
];

const StepIconComponent = (props) => {
  const { active, completed, icon } = props;

  const icons = {
    0: <HourglassBottom sx={{ fontSize: 16 }} />,
    1: <Code sx={{ fontSize: 16 }} />,
    2: <CheckCircle sx={{ fontSize: 16 }} />,
    3: <Science sx={{ fontSize: 16 }} />,
    4: <Science sx={{ fontSize: 16 }} />,
    5: <CheckCircle sx={{ fontSize: 16 }} />,
    6: <RocketLaunch sx={{ fontSize: 16 }} />,
  };

  let bg = "#f1f5f9";
  let color = "#64748b";
  let border = "2px solid #e2e8f0";
  let shadow = "none";

  if (completed) {
    // Accent 3: Fresh Emerald / Teal
    bg = "linear-gradient(135deg, #10b981 0%, #0d9488 100%)";
    color = "#ffffff";
    border = "2px solid #6ee7b7";
    shadow = "0 3px 8px rgba(16, 185, 129, 0.35)";
  } else if (active) {
    // Primary 1: Electric Indigo / Vivid Violet
    bg = "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)";
    color = "#ffffff";
    border = "2px solid #c7d2fe";
    shadow = "0 3px 10px rgba(79, 70, 229, 0.4)";
  }

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color: color,
        border: border,
        boxShadow: shadow,
        transition: "all 0.3s ease",
      }}
    >
      {completed ? <CheckCircle sx={{ fontSize: 17 }} /> : icons[Number(icon)] || <HourglassBottom sx={{ fontSize: 16 }} />}
    </Box>
  );
};

const mergeTrackingTasks = (rawList) => {
  if (!Array.isArray(rawList)) return [];

  const taskMap = new Map();

  rawList.forEach((item) => {
    const taskId = item.taskId;
    if (taskId === undefined || taskId === null) return;

    if (!taskMap.has(taskId)) {
      taskMap.set(taskId, {
        taskId,
        taskTitle: item.taskTitle || item.title || `Task #${taskId}`,
        taskStatus: item.taskStatus || item.status || "Assigned",
        assignedMember: "",
        assignedMemberId: "",
        assignedDate: "",
        devAssignedDate: "",
        assignedDateWithTime: "",
        assignedTester: "",
        assignedTesterId: "",
        testAssignedDate: "",
        liveDeployedDate: item.liveDeployedDate || "",
        deployedBy: item.deployedBy || "",
        createdOn: item.createdOn || item.createdAt || "",
      });
    }

    const merged = taskMap.get(taskId);

    if (item.taskTitle || item.title) {
      merged.taskTitle = item.taskTitle || item.title;
    }

    // Status progression priority: ensure latest pipeline status wins
    const statusPriority = {
      "Assigned": 1,
      "Work In Progress": 2,
      "In Progress": 2,
      "Development Completed": 3,
      "Work Completed": 3,
      "Developing Completed": 3,
      "Testing Assigned": 4,
      "Testing In Progress": 5,
      "Testing Completed": 6,
      "Closed": 7,
      "Live Deployed": 7,
      "Completed": 7,
    };
    const currentStatus = merged.taskStatus;
    const newStatus = item.taskStatus || item.status;
    if ((statusPriority[newStatus] || 0) >= (statusPriority[currentStatus] || 0)) {
      merged.taskStatus = newStatus;
    }

    const isTesterRecord =
      item.roleType === "tester" ||
      (item.assignedTester && item.name && item.name === item.assignedTester);

    const isDevRecord =
      item.roleType === "developer" ||
      (!isTesterRecord && item.roleType !== "tester");

    // Developer details
    if (item.assignedMember) {
      merged.assignedMember = item.assignedMember;
    }
    if (item.assignedMemberId) {
      merged.assignedMemberId = item.assignedMemberId;
    }
    if (item.assignedDate) {
      merged.assignedDate = item.assignedDate;
      merged.devAssignedDate = item.assignedDate;
    }
    if (item.devAssignedDate) {
      merged.assignedDate = item.devAssignedDate;
      merged.devAssignedDate = item.devAssignedDate;
    }

    if (isDevRecord) {
      if (!merged.assignedMember && item.name) {
        merged.assignedMember = item.name;
      }
      if (!merged.assignedMemberId && item.employeeId) {
        merged.assignedMemberId = item.employeeId;
      }
      if (!merged.assignedDate && item.assignedDateWithTime) {
        merged.assignedDate = item.assignedDateWithTime;
        merged.devAssignedDate = item.assignedDateWithTime;
      }
    }

    // Tester details
    if (item.assignedTester) {
      merged.assignedTester = item.assignedTester;
    }
    if (item.assignedTesterId) {
      merged.assignedTesterId = item.assignedTesterId;
    }
    if (item.testAssignedDate) {
      merged.testAssignedDate = item.testAssignedDate;
    }

    if (isTesterRecord) {
      if (!merged.assignedTester && item.name) {
        merged.assignedTester = item.name;
      }
      if (!merged.assignedTesterId && item.employeeId) {
        merged.assignedTesterId = item.employeeId;
      }
      if (!merged.testAssignedDate && item.assignedDateWithTime) {
        merged.testAssignedDate = item.assignedDateWithTime;
      }
      if (item.assignedMember && !merged.assignedMember) {
        merged.assignedMember = item.assignedMember;
      }
      if (item.devAssignedDate && !merged.assignedDate) {
        merged.assignedDate = item.devAssignedDate;
        merged.devAssignedDate = item.devAssignedDate;
      }
    }

    // Live deployment details
    if (item.liveDeployedDate) {
      merged.liveDeployedDate = item.liveDeployedDate;
    }
    if (item.deployedBy) {
      merged.deployedBy = item.deployedBy;
    }
    if (item.createdOn && !merged.createdOn) {
      merged.createdOn = item.createdOn;
    }
  });

  return Array.from(taskMap.values());
};

const TaskStepperCard = ({ task }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let activeStep = 0;
  let currentStatusText = "Task Assigned";

  const status = task.taskStatus || task.status || "Assigned";

  const devName =
    task.assignedMember ||
    (task.roleType === "developer" ? task.name : "") ||
    "";
  const devAssignedTime =
    task.devAssignedDate ||
    task.assignedDate ||
    (task.roleType === "developer" ? task.assignedDateWithTime : "") ||
    task.assignedDateWithTime ||
    "";

  const testerName =
    task.assignedTester ||
    (task.roleType === "tester" ? task.name : "") ||
    "";
  const testAssignedTime =
    task.testAssignedDate ||
    (task.roleType === "tester" ? task.assignedDateWithTime : "") ||
    "";

  if (status === "Assigned") {
    activeStep = 0;
    currentStatusText = devName
      ? `Task Assigned to ${devName} (Awaiting Development)`
      : "Assigned (Awaiting Development)";
  } else if (status === "Work In Progress" || status === "In Progress") {
    activeStep = 1;
    currentStatusText = devName
      ? `In Active Development by ${devName}`
      : "In Active Development";
  } else if (
    status === "Development Completed" ||
    status === "Work Completed" ||
    status === "Developing Completed"
  ) {
    activeStep = 2;
    currentStatusText = devName
      ? `Development Completed by ${devName} (Ready for QA Assignment)`
      : "Development Completed (Ready for QA Assignment)";
  } else if (status === "Testing Assigned") {
    activeStep = 3;
    currentStatusText = `Testing Assigned to ${testerName || "QA Tester"}`;
  } else if (status === "Testing In Progress") {
    activeStep = 4;
    currentStatusText = testerName
      ? `QA Testing in Progress by ${testerName}`
      : "QA Testing in Progress";
  } else if (status === "Testing Completed") {
    activeStep = 5;
    currentStatusText = testerName
      ? `Testing Completed by ${testerName} (Ready for Live Deployment)`
      : "Testing Completed (Ready for Live Deployment)";
  } else if (status === "Closed" || status === "Live Deployed" || status === "Completed") {
    activeStep = 7; // All 7 steps (0 to 6) completed
    currentStatusText = `Closed (Live Deployed${task.deployedBy ? ` by ${task.deployedBy}` : ""})`;
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: `1px solid ${theme.palette.divider}`,
        mb: 3,
        boxShadow: isDark
          ? "0 4px 16px rgba(0, 0, 0, 0.35)"
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
        bgcolor: theme.palette.background.paper,
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          boxShadow: isDark
            ? "0 8px 30px rgba(0, 0, 0, 0.55)"
            : "0 8px 24px rgba(0, 0, 0, 0.08)",
          borderColor: isDark ? "#409cff" : "#0071e3",
          transform: "translateY(-1.5px)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={1.5}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2, mb: 2.5 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 750, color: theme.palette.text.primary, lineHeight: 1.3, fontSize: { xs: "1rem", sm: "1.15rem" } }}>
              {task.taskTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5, fontSize: "0.825rem" }}>
              Task ID: <span style={{ fontWeight: 700, color: isDark ? "#409cff" : "#0071e3" }}>#{task.taskId}</span>
            </Typography>
          </Box>
          <Chip
            label={task.taskStatus || "Assigned"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: isDark
                ? "rgba(10, 132, 255, 0.16)"
                : "rgba(0, 113, 227, 0.08)",
              color: isDark ? "#409cff" : "#0071e3",
              border: `1px solid ${isDark ? "rgba(10, 132, 255, 0.3)" : "rgba(0, 113, 227, 0.2)"}`,
            }}
          />
        </Box>

        {/* Current Stage Indicator */}
        <Box
          sx={{
            p: 1.75,
            borderRadius: "12px",
            bgcolor: isDark
              ? "rgba(10, 132, 255, 0.1)"
              : "rgba(0, 113, 227, 0.05)",
            border: `1px solid ${isDark ? "rgba(10, 132, 255, 0.25)" : "rgba(0, 113, 227, 0.15)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.25}>
            <CheckCircle sx={{ color: isDark ? "#409cff" : "#0071e3", fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 650, color: theme.palette.text.primary }}>
              Current Pipeline Stage:{" "}
              <span style={{ color: isDark ? "#409cff" : "#0071e3", fontWeight: 800 }}>
                {currentStatusText}
              </span>
            </Typography>
          </Box>
        </Box>

        {/* Responsive Stepper Container */}
        <Box
          sx={{
            width: "100%",
            p: { xs: 1.5, sm: 2.5 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
          }}
        >
          <Stepper
            activeStep={activeStep}
            orientation={isMobile ? "vertical" : "horizontal"}
            alternativeLabel={!isMobile}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel
                  StepIconComponent={StepIconComponent}
                  icon={index}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: index <= activeStep ? 750 : 500,
                      color:
                        index < activeStep
                          ? isDark ? "#30d158" : "#248a3d"
                          : index === activeStep
                          ? isDark ? "#409cff" : "#0071e3"
                          : theme.palette.text.secondary,
                      fontSize: { xs: "0.8rem", sm: "0.75rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Merged Developer and Tester Lifecycle Info Bar */}
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            alignItems: "stretch",
          }}
        >
          {/* Assigned Developer & Time */}
          <Grid item xs={12} sm={task.liveDeployedDate ? 4 : 6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  p: 0.85,
                  borderRadius: "8px",
                  bgcolor: isDark
                    ? "rgba(10, 132, 255, 0.18)"
                    : "rgba(0, 113, 227, 0.1)",
                  color: isDark ? "#409cff" : "#0071e3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                  }}
                >
                  Assigned Developer
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 750,
                    color: devName ? theme.palette.text.primary : theme.palette.text.disabled,
                    fontSize: "13.5px",
                    mt: 0.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {devName || "Not Assigned"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "11.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <AccessTime sx={{ fontSize: 13, color: theme.palette.text.secondary }} />
                  {devAssignedTime ? (
                    <>
                      Assigned:{" "}
                      <strong style={{ color: theme.palette.text.primary }}>
                        {devAssignedTime}
                      </strong>
                    </>
                  ) : (
                    <span style={{ color: theme.palette.text.disabled }}>Recently Assigned</span>
                  )}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Assigned Tester & Time */}
          <Grid item xs={12} sm={task.liveDeployedDate ? 4 : 6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  p: 0.85,
                  borderRadius: "8px",
                  bgcolor: testerName
                    ? isDark
                      ? "rgba(191, 90, 242, 0.18)"
                      : "rgba(175, 82, 222, 0.12)"
                    : isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.04)",
                  color: testerName
                    ? isDark ? "#bf5af2" : "#af52de"
                    : theme.palette.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Science sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: testerName
                      ? isDark ? "#bf5af2" : "#af52de"
                      : theme.palette.text.secondary,
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                  }}
                >
                  Assigned Tester
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 750,
                    color: testerName ? theme.palette.text.primary : theme.palette.text.disabled,
                    fontSize: "13.5px",
                    mt: 0.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {testerName || "Not Assigned Yet"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "11.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <AccessTime sx={{ fontSize: 13, color: "#94a3b8" }} />
                  {testAssignedTime ? (
                    <>
                      Assigned:{" "}
                      <strong style={{ color: "#334155" }}>
                        {testAssignedTime}
                      </strong>
                    </>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>Pending QA Assignment</span>
                  )}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Live Deployment (if deployed) */}
          {task.liveDeployedDate && (
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  bgcolor: "#f0fdfa",
                  border: "1px solid #99f6e4",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 0.85,
                    borderRadius: "8px",
                    bgcolor: "#ccfbf1",
                    color: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#0d9488",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    Live Deployed
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 750,
                      color: "#0f766e",
                      fontSize: "13.5px",
                      mt: 0.25,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {task.deployedBy ? `by ${task.deployedBy}` : "Production Live"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#0d9488",
                      fontSize: "11.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 13, color: "#0d9488" }} />
                    <strong style={{ color: "#0f766e" }}>{task.liveDeployedDate}</strong>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

const TrackingStatus = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const user = useSelector(selectUser);
  const employee = useSelector(selectEmployee);

  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchTracking = useCallback(async () => {
    try {
      setLoading(true);
      const activeUser = user || employee;
      const isAdmin = activeUser?.userType === "Admin";
      const empId = isAdmin ? undefined : (activeUser?.employeeId || activeUser?.id);

      const res = await apiService.getTrackingList(empId, isAdmin ? "Admin" : activeUser?.userType);
      const merged = mergeTrackingTasks(Array.isArray(res) ? res : []);
      setStatusData(merged);
    } catch (err) {
      // Gracefully handle tracking load without console error
    } finally {
      setLoading(false);
    }
  }, [user, employee]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  const activeUser = user || employee;
  const isAdmin = activeUser?.userType === "Admin";

  return (
    <Box sx={{ width: "100%" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "10px", fontWeight: 500 }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header Bar */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2.2, md: 3 },
          borderRadius: "16px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? "0 4px 20px rgba(0, 0, 0, 0.4)"
            : "0 2px 10px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
            <Chip
              label={
                isAdmin
                  ? "Admin Lead • Pipeline"
                  : `Contributor • ${activeUser?.name || "My Tasks"}`
              }
              size="small"
              sx={{
                bgcolor: isDark
                  ? "rgba(10, 132, 255, 0.16)"
                  : "rgba(0, 113, 227, 0.08)",
                color: isDark ? "#409cff" : "#0071e3",
                fontWeight: 650,
                fontSize: "11px",
                height: 22,
                border: `1px solid ${
                  isDark ? "rgba(10, 132, 255, 0.3)" : "rgba(0, 113, 227, 0.2)"
                }`,
              }}
            />
            <Chip
              label={`${statusData.length} Tracked`}
              size="small"
              sx={{
                fontWeight: 650,
                fontSize: "11px",
                height: 22,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.04)",
                color: theme.palette.text.secondary,
              }}
            />
          </Box>
          <Typography
            variant="h4"
            fontWeight={750}
            color={theme.palette.text.primary}
            sx={{ letterSpacing: "-0.025em", fontSize: { xs: "1.45rem", sm: "1.8rem" } }}
          >
            {isAdmin ? "Overall Sprint Lifecycle Tracking" : "My Task Lifecycle Tracking"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.4, fontSize: "0.875rem" }}
          >
            {isAdmin
              ? "Comprehensive visual progress tracker across all sprint tasks from development to production deployment."
              : "Visual progress tracker for tasks assigned to you across development, QA verification, and live deployment."}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={32} sx={{ color: "#4f46e5" }} />
        </Box>
      ) : Array.isArray(statusData) && statusData.length > 0 ? (
        statusData.map((taskData, index) => (
          <TaskStepperCard
            key={taskData.taskId || index}
            task={taskData}
          />
        ))
      ) : (
        <Card sx={{ p: 5, textAlign: "center", borderRadius: "16px", mt: 3, border: "1px solid #e2e8f0" }} elevation={0}>
          <Typography variant="h6" color="#0f172a" fontWeight={750}>
            {isAdmin
              ? "No active sprint tasks currently tracked."
              : "No sprint tasks currently assigned to you."}
          </Typography>
          <Typography variant="body2" color="#64748b" mt={1}>
            {isAdmin
              ? "Assign tasks to team members to start tracking their development and QA pipeline!"
              : "Tasks assigned to you for development or QA testing will appear here with live lifecycle stages."}
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default TrackingStatus;