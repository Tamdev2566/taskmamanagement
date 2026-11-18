import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  CardHeader,
  CardActions,
  Avatar,
  Tooltip,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  PeopleAlt,
  Assignment,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Science as ScienceIcon,
  RocketLaunch as RocketLaunchIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UpdateIcon from "@mui/icons-material/Update";
import { ClipboardList, WorkflowIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../globalData/authSlice";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import apiService from "./services/apiServices";

const Task = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [taskDetail, setTaskDetail] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Workflow modals
  const [openTestModal, setOpenTestModal] = useState(false);
  const [testTaskDetail, setTestTaskDetail] = useState(null);
  const [openLiveModal, setOpenLiveModal] = useState(false);
  const [liveTaskDetail, setLiveTaskDetail] = useState(null);
  const [openTestingCompleteModal, setOpenTestingCompleteModal] = useState(false);
  const [completeTaskDetail, setCompleteTaskDetail] = useState(null);

  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    taskId: "",
    taskTitle: "",
    priority: null,
    workType: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const priorities = ["High", "Medium", "Low"];
  const workTypes = ["Epic", "Spike/Research", "Feature/Enhancement", "Bug", "Task", "Frontend", "Backend", "Full Stack", "Design", "Testing"];

  const getTask = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getTask();
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeam = useCallback(async () => {
    try {
      const res = await apiService.getTeam(user?.employeeId);
      setTeamData(Array.isArray(res) ? res : []);
    } catch (err) {
      // Graceful fallback
    }
  }, [user?.employeeId]);

  useEffect(() => {
    getTask();
    getTeam();
  }, [getTask, getTeam]);

  // Auto-open task modal when navigated from notification
  useEffect(() => {
    if (location.state?.openTaskId && tasks.length > 0) {
      const targetId = location.state.openTaskId;
      const targetTask = tasks.find(
        (t) =>
          String(t.taskId) === String(targetId) ||
          String(t.id) === String(targetId) ||
          String(t._id) === String(targetId)
      );
      if (targetTask) {
        setSelectedTask(targetTask);
        setOpenDetailModal(true);
      }
    }
  }, [location.state, tasks]);

  // Workflow handlers
  const handleStartWork = async (task) => {
    try {
      const res = await apiService.startWork(task.taskId || task.id, user?.employeeId);
      setSnackbar({
        open: true,
        message: res.message || "Work started on task!",
        severity: "success",
      });
      getTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to start work",
        severity: "error",
      });
    }
  };

  const handleWorkCompleted = async (task) => {
    try {
      const res = await apiService.workCompleted(
        task.taskId || task.id,
        user?.employeeId,
        "Development work completed; ready for QA testing",
        user?.email
      );
      setSnackbar({
        open: true,
        message: res.message || "Development completed! Ready for QA testing assignment.",
        severity: "success",
      });
      getTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to complete work",
        severity: "error",
      });
    }
  };

  const handleStartTesting = async (task) => {
    try {
      const res = await apiService.startTesting(task.taskId || task.id, user?.employeeId);
      setSnackbar({
        open: true,
        message: res.message || "QA Testing started!",
        severity: "success",
      });
      getTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to start testing",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    let filtered = tasks.filter((t) => {
      const idMatch =
        filters.taskId === "" ||
        String(t?.taskId || t?.id || "").includes(filters.taskId);
      const titleMatch =
        filters.taskTitle === "" ||
        (t.title &&
          t.title.toLowerCase().includes(filters.taskTitle.toLowerCase()));
      const priorityMatch =
        filters.priority === null || t.priority === filters.priority;
      const workTypeMatch =
        filters.workType === null || t.workType === filters.workType;

      return idMatch && titleMatch && priorityMatch && workTypeMatch;
    });
    setFilteredTasks(filtered);
  }, [filters, tasks]);

  const handleDeleteTask = async (task) => {
    const targetId = task.taskId || task.id || task._id;
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    try {
      const res = await apiService.deletTask({ id: targetId });
      setSnackbar({
        open: true,
        message: res.message || "Task deleted successfully",
        severity: "success",
      });
      getTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete task",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setOpenDetailModal(true);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "#1976D2";
      case "Work In Progress":
      case "In Progress":
        return "#4F46E5";
      case "Development Completed":
      case "Work Completed":
      case "Developing Completed":
        return "#7C3AED";
      case "Testing Assigned":
        return "#D97706";
      case "Testing In Progress":
        return "#EA580C";
      case "Testing Completed":
        return "#0D9488";
      case "Closed":
      case "Live Deployed":
      case "Completed":
        return "#16A34A";
      default:
        return "#EF4444";
    }
  };

  const statusChipColor = (status) => {
    switch (status) {
      case "Assigned":
      case "Work In Progress":
      case "In Progress":
        return "primary";
      case "Development Completed":
      case "Work Completed":
      case "Developing Completed":
        return "secondary";
      case "Testing Assigned":
      case "Testing In Progress":
        return "warning";
      case "Testing Completed":
        return "info";
      case "Closed":
      case "Live Deployed":
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Page Header */}
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
            <Chip
              label="Sprint Board"
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
              label={`${filteredTasks.length} ${
                filteredTasks.length === 1 ? "Task" : "Tasks"
              }`}
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
            sx={{ letterSpacing: "-0.025em" }}
          >
            Sprint Work Items
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.4 }}
          >
            Manage development cycles, assign QA testers, and track production release pipeline.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          {(user?.userType === "Admin" || user?.canCreateTask) && (
            <Button
              variant="contained"
              component={Link}
              to="/createtask"
              color="primary"
            >
              + Create Task
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter Card */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: "16px",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={650}
          mb={2}
          color={theme.palette.text.primary}
          sx={{ letterSpacing: "-0.01em" }}
        >
          Filter Sprint Tasks
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Task ID"
              fullWidth
              size="small"
              value={filters.taskId}
              onChange={(e) =>
                setFilters({ ...filters, taskId: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Task Title"
              fullWidth
              size="small"
              value={filters.taskTitle}
              onChange={(e) =>
                setFilters({ ...filters, taskTitle: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={priorities}
              value={filters.priority}
              onChange={(e, newValue) =>
                setFilters({ ...filters, priority: newValue })
              }
              renderInput={(params) => (
                <TextField {...params} label="Priority" size="small" />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={workTypes}
              value={filters.workType}
              onChange={(e, newValue) =>
                setFilters({ ...filters, workType: newValue })
              }
              renderInput={(params) => (
                <TextField {...params} label="Work Type" size="small" />
              )}
            />
          </Grid>
        </Grid>
      </Card>

      <Box
        sx={{
          minHeight: "500px",
          maxHeight: "750px",
          overflowY: "auto",
          p: 2.5,
          bgcolor: isDark ? "rgba(20, 20, 24, 0.6)" : "rgba(240, 240, 243, 0.6)",
          borderRadius: "16px",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const cardBorderColor = statusColor(task.status);
                const displayId = task.taskId || task.id || "N/A";
                const isAdmin = user?.userType === "Admin";
                const isAssignedDev =
                  (user?.employeeId && task.assignedMemberId === user.employeeId) ||
                  (user?.username && task.assignedMember === user.username);
                const isAssignedTester =
                  (user?.employeeId && task.assignedTesterId === user.employeeId) ||
                  (user?.username && task.assignedTester === user.username);

                return (
                  <Grid item key={task._id || task.taskId || task.id} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
                    <Card
                      elevation={0}
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "14px",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        boxShadow: isDark
                          ? "0 4px 16px rgba(0, 0, 0, 0.35)"
                          : "0 2px 8px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          borderColor: cardBorderColor,
                          boxShadow: isDark
                            ? "0 8px 28px rgba(0, 0, 0, 0.55)"
                            : "0 8px 24px rgba(0, 0, 0, 0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {/* Top Accent Bar */}
                      <Box
                        sx={{
                          height: 3,
                          width: "100%",
                          bgcolor: cardBorderColor,
                        }}
                      />

                      {/* Card Header: ID, Work Type, Status, Title */}
                      <Box sx={{ p: 2, pb: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mb={1.25}>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography
                              sx={{
                                fontFamily: "var(--mac-mono)",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: theme.palette.text.secondary,
                                bgcolor: isDark
                                  ? "rgba(255, 255, 255, 0.06)"
                                  : "rgba(0, 0, 0, 0.04)",
                                px: 1,
                                py: 0.3,
                                borderRadius: "6px",
                                border: `1px solid ${theme.palette.divider}`,
                                letterSpacing: "0.03em",
                              }}
                            >
                              #{displayId}
                            </Typography>
                            {task.workType && (
                              <Chip
                                label={task.workType}
                                size="small"
                                sx={{
                                  fontSize: "0.68rem",
                                  height: 20,
                                  fontWeight: 600,
                                  borderRadius: "6px",
                                  bgcolor: isDark
                                    ? "rgba(255, 255, 255, 0.04)"
                                    : "rgba(0, 0, 0, 0.03)",
                                  border: `1px solid ${theme.palette.divider}`,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                            )}
                          </Box>

                          {/* Status Badge */}
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.75,
                              px: 1.2,
                              py: 0.35,
                              borderRadius: "8px",
                              bgcolor: `${cardBorderColor}14`,
                              border: `1px solid ${cardBorderColor}35`,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: cardBorderColor,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: cardBorderColor,
                                whiteSpace: "nowrap",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {task.status || "Unassigned"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Task Title */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            lineHeight: 1.4,
                            fontSize: "0.925rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.6em",
                          }}
                          title={task.title}
                        >
                          {task.title || "Untitled Task"}
                        </Typography>
                      </Box>

                      {/* Card Body: Structured Metadata Grid */}
                      <CardContent sx={{ p: 2, pt: 1.5, pb: 1, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
                        {/* Priority & Est. Hours Matrix */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              bgcolor: isDark
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(0, 0, 0, 0.02)",
                              border: `1px solid ${theme.palette.divider}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary, fontWeight: 600 }}>
                              Priority
                            </Typography>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.2,
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: getPriorityColor(task.priority),
                                bgcolor: `${getPriorityColor(task.priority)}15`,
                                border: `1px solid ${getPriorityColor(task.priority)}30`,
                              }}
                            >
                              {task.priority || "-"}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              bgcolor: isDark
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(0, 0, 0, 0.02)",
                              border: `1px solid ${theme.palette.divider}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary, fontWeight: 600 }}>
                              Est. Time
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.primary, fontWeight: 700 }}>
                              {task.duration ? `${task.duration} hrs` : "-"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* People Assignment Box */}
                        <Box
                          sx={{
                            p: 1.25,
                            borderRadius: "10px",
                            bgcolor: isDark
                              ? "rgba(255, 255, 255, 0.03)"
                              : "rgba(0, 0, 0, 0.02)",
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                              <PersonIcon sx={{ fontSize: 15, color: isDark ? "#409cff" : "#0071e3" }} />
                              <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary, fontWeight: 600 }}>
                                Assigned To
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: task.assignedMember ? theme.palette.text.primary : theme.palette.text.disabled,
                              }}
                            >
                              {task.assignedMember || "Unassigned"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                              <AssignmentTurnedInIcon sx={{ fontSize: 15, color: theme.palette.text.secondary }} />
                              <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary, fontWeight: 600 }}>
                                Assigned By
                              </Typography>
                            </Box>
                            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: theme.palette.text.primary }}>
                              {task.assignedBy || "-"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 0.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                              <ScienceIcon sx={{ fontSize: 15, color: task.assignedTester ? (isDark ? "#bf5af2" : "#7c3aed") : theme.palette.text.secondary }} />
                              <Typography sx={{ fontSize: "0.72rem", color: task.assignedTester ? (isDark ? "#bf5af2" : "#7c3aed") : theme.palette.text.secondary, fontWeight: 600 }}>
                                QA Tester
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                fontWeight: task.assignedTester ? 700 : 500,
                                color: task.assignedTester
                                  ? (isDark ? "#bf5af2" : "#6d28d9")
                                  : theme.palette.text.secondary,
                              }}
                            >
                              {task.assignedTester || "Not Assigned"}
                            </Typography>
                          </Box>

                          {task.liveDeployedDate && (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 0.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <RocketLaunchIcon sx={{ fontSize: 15, color: isDark ? "#30d158" : "#059669" }} />
                                <Typography sx={{ fontSize: "0.72rem", color: isDark ? "#30d158" : "#059669", fontWeight: 600 }}>
                                  Live Deployed
                                </Typography>
                              </Box>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: isDark ? "#30d158" : "#047857" }}>
                                {task.liveDeployedDate}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Timestamps */}
                        <Box sx={{ mt: "auto", pt: 0.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography sx={{ fontSize: "0.7rem", color: theme.palette.text.secondary, display: "flex", alignItems: "center", gap: 0.5 }}>
                            <EditCalendarIcon sx={{ fontSize: 13 }} />
                            {task?.createdOn ? new Date(task.createdOn).toLocaleDateString() : "-"}
                          </Typography>
                          {task.createdBy && (
                            <Typography sx={{ fontSize: "0.7rem", color: theme.palette.text.secondary }}>
                              By: <strong style={{ color: theme.palette.text.primary }}>{task.createdBy}</strong>
                            </Typography>
                          )}
                        </Box>

                        {task.modifiedBy && (
                          <Typography sx={{ fontSize: "0.68rem", color: theme.palette.text.secondary, fontStyle: "italic", textAlign: "right" }}>
                            <UpdateIcon sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                            Updated by <strong>{task.modifiedBy}</strong> on {new Date(task.modifiedOn).toLocaleDateString()}
                          </Typography>
                        )}
                      </CardContent>

                      {/* Card Action Buttons (macOS Rounded Glassmorphism Style) */}
                      <CardActions sx={{ mt: "auto", px: 2, pb: 1.75, pt: 1.25, display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 0.75, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(task)}
                          startIcon={<VisibilityIcon sx={{ fontSize: 15 }} />}
                        >
                          View
                        </Button>

                        {/* Admin Action: Assign / Reassign */}
                        {isAdmin && ["Unassigned", "Assigned"].includes(task.status) && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setOpenModal(true);
                              setTaskDetail(task);
                            }}
                            startIcon={<AssignmentIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              bgcolor: "#2563eb",
                              color: "#fff",
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#1d4ed8" },
                            }}
                          >
                            {task.status === "Assigned" ? "Reassign" : "Assign"}
                          </Button>
                        )}

                        {/* Admin / Tester Head Action: Test Assign */}
                        {(isAdmin || user?.canCreateTask) && ["Development Completed", "Work Completed", "Developing Completed"].includes(task.status) && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setTestTaskDetail(task);
                              setOpenTestModal(true);
                            }}
                            startIcon={<ScienceIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              bgcolor: "#7c3aed",
                              color: "#fff",
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#6d28d9" },
                            }}
                          >
                            Test Assign
                          </Button>
                        )}

                        {/* Admin Action: Mark as Live */}
                        {isAdmin && task.status === "Testing Completed" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setLiveTaskDetail(task);
                              setOpenLiveModal(true);
                            }}
                            startIcon={<RocketLaunchIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              bgcolor: "#0f766e",
                              color: "#fff",
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#115e59" },
                            }}
                          >
                            Mark as Live
                          </Button>
                        )}

                        {/* Developer Action: Work Completed (Direct completion without Start Work button) */}
                        {(isAssignedDev || isAdmin) &&
                          ["Assigned", "Work In Progress", "In Progress"].includes(task.status) && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleWorkCompleted(task)}
                              startIcon={<CheckCircleIcon sx={{ fontSize: 15 }} />}
                              sx={{
                                bgcolor: "#059669",
                                color: "#fff",
                                borderRadius: '8px',
                                fontSize: "0.75rem",
                                fontWeight: 650,
                                textTransform: "none",
                                px: 1.5,
                                py: 0.4,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#047857" },
                              }}
                            >
                              Work Completed
                            </Button>
                          )}

                        {/* Tester Action: Start Testing */}
                        {(isAssignedTester || isAdmin) && task.status === "Testing Assigned" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStartTesting(task)}
                            startIcon={<ScienceIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              bgcolor: "#d97706",
                              color: "#fff",
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#b45309" },
                            }}
                          >
                            Start Testing
                          </Button>
                        )}

                        {/* Tester Action: Testing Completed */}
                        {(isAssignedTester || isAdmin) && task.status === "Testing In Progress" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setCompleteTaskDetail(task);
                              setOpenTestingCompleteModal(true);
                            }}
                            startIcon={<CheckCircleIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              bgcolor: "#0d9488",
                              color: "#fff",
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#0f766e" },
                            }}
                          >
                            Testing Completed
                          </Button>
                        )}

                        {["Closed", "Live Deployed"].includes(task.status) && (
                          <Chip
                            icon={<RocketLaunchIcon sx={{ fontSize: 14 }} />}
                            label={task.status === "Closed" ? "Closed (Live Deployed)" : "Live Deployed"}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              borderRadius: '8px',
                              bgcolor: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #a7f3d0",
                            }}
                          />
                        )}

                        {isAdmin && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeleteTask(task)}
                            startIcon={<DeleteIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              borderRadius: '8px',
                              fontSize: "0.75rem",
                              fontWeight: 650,
                              textTransform: "none",
                              borderColor: "#fecaca",
                              color: "#dc2626",
                              px: 1.25,
                              py: 0.4,
                              boxShadow: "none",
                              "&:hover": { borderColor: "#f87171", bgcolor: "#fef2f2" },
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-[50vh] w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center p-8 rounded-2xl"
                >
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-indigo-100 p-4 rounded-full"
                    >
                      <ClipboardList className="text-indigo-500 w-10 h-10" />
                    </motion.div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Tasks Available
                  </h2>
                  <p className="text-gray-500 mb-6">
                    You currently don’t have any tasks matching your filters.
                  </p>

                  <button
                    className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md"
                    onClick={() => navigate("/createtask")}
                  >
                    Add New Work
                  </button>
                </motion.div>
              </div>
            )}
          </Grid>
        )}
      </Box>

      <TaskAssignModal
        openModal={openModal}
        handleCloseModal={() => setOpenModal(false)}
        teamData={teamData}
        taskDetail={taskDetail}
        onAssignSuccess={() => {
          getTask();
          setSnackbar({
            open: true,
            message: "Task assigned successfully!",
            severity: "success",
          });
        }}
      />

      <TestAssignModal
        openModal={openTestModal}
        handleCloseModal={() => setOpenTestModal(false)}
        taskDetail={testTaskDetail}
        onAssignSuccess={() => {
          getTask();
          setSnackbar({
            open: true,
            message: "Task assigned for QA testing successfully!",
            severity: "success",
          });
        }}
      />

      <MarkLiveModal
        openModal={openLiveModal}
        handleCloseModal={() => setOpenLiveModal(false)}
        taskDetail={liveTaskDetail}
        onLiveSuccess={() => {
          getTask();
          setSnackbar({
            open: true,
            message: "Task marked as Live Deployed! 🚀",
            severity: "success",
          });
        }}
      />

      <TestingCompleteModal
        openModal={openTestingCompleteModal}
        handleCloseModal={() => setOpenTestingCompleteModal(false)}
        taskDetail={completeTaskDetail}
        onCompleteSuccess={() => {
          getTask();
          setSnackbar({
            open: true,
            message: "QA Testing marked as Completed! Task is now eligible for Live Deployment.",
            severity: "success",
          });
        }}
      />

      <TaskDetailModal
        open={openDetailModal}
        handleClose={() => setOpenDetailModal(false)}
        task={selectedTask}
        onSaveSuccess={() => {
          getTask();
          setSnackbar({
            open: true,
            message: "Task details updated!",
            severity: "success",
          });
        }}
        user={user}
      />
    </div>
  );
};

export default Task;

export const TaskDetailModal = ({
  open,
  handleClose,
  task,
  onSaveSuccess,
  user,
}) => {
  const reduxUser = useSelector(selectUser);
  const activeUser = user || reduxUser;
  const isAdmin = activeUser?.userType === "Admin";

  const isCreator = Boolean(
    activeUser &&
    task &&
    (
      (task.createdById && String(task.createdById) === String(activeUser.employeeId || activeUser.id)) ||
      (task.createdByEmail && task.createdByEmail.toLowerCase() === (activeUser.email || "").toLowerCase()) ||
      (task.createdBy && (
        task.createdBy.toLowerCase() === (activeUser.email || "").toLowerCase() ||
        task.createdBy.toLowerCase() === (activeUser.userName || activeUser.username || activeUser.name || "").toLowerCase()
      ))
    )
  );

  const canEditTask = isAdmin || isCreator;

  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) setFormValues({ ...task });
  }, [task]);

  if (!task) return null;

  const handleCloseMod = () => {
    setEditMode(false);
    handleClose();
  };

  const handleSave = async () => {
    if (!canEditTask) {
      alert("Permission Denied: Only Admin and the creator of this ticket can edit task details.");
      return;
    }

    try {
      setSaving(true);
      await apiService.postTask({
        ...formValues,
        _id: task._id,
        taskId: task.taskId,
        userEmpId: activeUser?.employeeId,
        userEmail: activeUser?.email,
        userType: activeUser?.userType,
        modifiedBy: activeUser?.username || activeUser?.userName || activeUser?.name || "Current User",
        modifiedOn: new Date().toISOString(),
      });
      setEditMode(false);
      handleClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      alert(err.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseMod} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TaskIcon />
          <Typography variant="h6">{task.title}</Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {["title", "description", "priority", "duration", "workType"].map(
            (field) => (
              <Grid item xs={12} key={field}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formValues[field] || ""}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {task[field] || "-"}
                  </Typography>
                )}
              </Grid>
            )
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              Lifecycle & Workflow Details
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" display="block">Current Status:</Typography>
            <Typography variant="body2" fontWeight="bold">{task.status || "Unassigned"}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" display="block">Assigned Developer:</Typography>
            <Typography variant="body2">{task.assignedMember ? `${task.assignedMember} (${task.assignedMemberId || "-"})` : "Not Assigned"}</Typography>
          </Grid>

          {task.startDate && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block">Dev Started:</Typography>
              <Typography variant="body2">{task.startDate}</Typography>
            </Grid>
          )}

          {task.completedDate && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block">Dev Completed:</Typography>
              <Typography variant="body2">{task.completedDate}</Typography>
            </Grid>
          )}

          {task.assignedTester && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block">Assigned QA Tester:</Typography>
              <Typography variant="body2" color="secondary.main" fontWeight="bold">{task.assignedTester} ({task.assignedTesterId || "-"})</Typography>
            </Grid>
          )}

          {task.testAssignedDate && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block">QA Test Assigned On:</Typography>
              <Typography variant="body2">{task.testAssignedDate} by {task.testAssignedBy || "Admin"}</Typography>
            </Grid>
          )}

          {task.testingCompletedDate && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" display="block">QA Testing Completed:</Typography>
              <Typography variant="body2">{task.testingCompletedDate}</Typography>
            </Grid>
          )}

          {task.testingRemarks && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">QA Testing Remarks:</Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", bgcolor: "grey.50", p: 1, borderRadius: 1 }}>
                "{task.testingRemarks}"
              </Typography>
            </Grid>
          )}

          {task.liveDeployedDate && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">Live Production Deployment:</Typography>
              <Typography variant="body2" color="success.main" fontWeight="bold">
                🚀 Deployed on {task.liveDeployedDate} by {task.deployedBy || "Admin"}
              </Typography>
            </Grid>
          )}

          {task.statusHistory && task.statusHistory.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Status History / Audit Trail
              </Typography>
              <List dense sx={{ bgcolor: "grey.50", borderRadius: 2, p: 1 }}>
                {task.statusHistory.map((hist, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="caption" fontWeight="bold">
                          {hist.status} — {new Date(hist.timestamp).toLocaleString()}
                        </Typography>
                      }
                      secondary={`By: ${hist.updatedBy} • ${hist.remarks || ""}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          px: 3,
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!canEditTask ? (
            <Chip
              size="small"
              label={`👁️ View-Only (Created by: ${task.createdBy || "Admin"})`}
              sx={{
                bgcolor: "#f1f5f9",
                color: "#64748b",
                fontWeight: 600,
                fontSize: "0.75rem",
                border: "1px solid #e2e8f0",
              }}
            />
          ) : (
            <Chip
              size="small"
              color={isAdmin ? "primary" : "secondary"}
              label={isAdmin ? "Admin Edit Access" : "Ticket Creator Access"}
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {editMode ? (
            <>
              <Button
                onClick={handleSave}
                variant="contained"
                color="success"
                disabled={saving}
                startIcon={<SaveIcon />}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => setEditMode(false)}
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {canEditTask && (
                <Button
                  onClick={() => setEditMode(true)}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  }}
                >
                  Edit Task
                </Button>
              )}
              <Button
                onClick={handleCloseMod}
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const TaskAssignModal = ({
  openModal,
  handleCloseModal,
  teamData,
  taskDetail,
  onAssignSuccess,
}) => {
  const user = useSelector(selectUser);
  const [assigning, setAssigning] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openModal) {
      setLoading(true);
      apiService
        .getEligibleAssignees(user?.employeeId, "developer")
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setAssignees(res);
          } else {
            setAssignees(teamData);
          }
        })
        .catch(() => setAssignees(teamData))
        .finally(() => setLoading(false));
    }
  }, [openModal, user?.employeeId]);

  const handleAssignTask = async (memberId) => {
    try {
      setAssigning(true);
      await apiService.assignTask({
        taskId: taskDetail.taskId || taskDetail.id,
        employeeId: memberId,
        assignedBy: user?.username || user?.userName || "Admin",
        adminEmpId: user?.employeeId,
        adminEmail: user?.email,
      });
      handleCloseModal();
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      alert(err.message || "Failed to assign task");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleAlt sx={{ fontSize: 28 }} />
          <Typography variant="h6">Assign Task</Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          <span className="font-bold">Task: </span>
          {taskDetail?.title || "Unknown Task"}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          Select a developer mapped to your organization to assign this task:
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {assignees.length > 0 ? (
              assignees.map((item, index) => (
                <React.Fragment key={item.employeeId || item.id || index}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleAssignTask(item.employeeId || item.id)
                        }
                        disabled={assigning}
                        size="small"
                        startIcon={<Assignment />}
                        sx={{ borderRadius: 10, fontSize: "11px" }}
                      >
                        Assign
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        <WorkflowIcon size={20} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`ID: ${item.employeeId || item.id} • ${
                        item.position
                      }`}
                    />
                  </ListItem>
                  {index < assignees.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" p={2}>
                No mapped developers available. Please ensure team members have roles matching your managed roles.
              </Typography>
            )}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleCloseModal} color="inherit" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const TestAssignModal = ({
  openModal,
  handleCloseModal,
  taskDetail,
  onAssignSuccess,
}) => {
  const user = useSelector(selectUser);
  const [testers, setTesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (openModal) {
      setLoading(true);
      apiService
        .getEligibleAssignees(user?.employeeId, "tester")
        .then((res) => {
          setTesters(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          setTesters([]);
        })
        .finally(() => setLoading(false));
    }
  }, [openModal, user?.employeeId]);

  const handleAssignTester = async (testerId) => {
    try {
      setAssigning(true);
      await apiService.testAssign(
        taskDetail.taskId || taskDetail.id,
        testerId,
        user?.employeeId,
        user?.username || user?.userName || "Admin",
        user?.email
      );
      handleCloseModal();
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      alert(err.message || "Failed to assign tester");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "secondary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScienceIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6">Assign for QA Testing</Typography>
        </Box>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          <strong>Task:</strong> {taskDetail?.title || "Untitled"}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          Select an eligible tester mapped to your organization to test this completed feature:
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={30} />
          </Box>
        ) : testers.length > 0 ? (
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {testers.map((item, index) => (
              <React.Fragment key={item.employeeId || item.id || index}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAssignTester(item.employeeId || item.id)}
                      disabled={assigning}
                      size="small"
                      startIcon={<ScienceIcon />}
                      sx={{ borderRadius: 10, fontSize: "11px" }}
                    >
                      Assign QA
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.light" }}>
                      <ScienceIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`ID: ${item.employeeId || item.id} • ${item.position}`}
                  />
                </ListItem>
                {index < testers.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box p={2} textAlign="center" bgcolor="grey.50" borderRadius={2}>
            <Typography variant="body2" color="text.secondary">
              No eligible testing team members found.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ensure testers (e.g. QA Engineer, Tester) are registered and mapped to your managed roles.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseModal} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const MarkLiveModal = ({
  openModal,
  handleCloseModal,
  taskDetail,
  onLiveSuccess,
}) => {
  const user = useSelector(selectUser);
  const [remarks, setRemarks] = useState("");
  const [deploying, setDeploying] = useState(false);

  const handleConfirmLive = async () => {
    try {
      setDeploying(true);
      await apiService.markLive(
        taskDetail.taskId || taskDetail.id,
        user?.employeeId,
        remarks || "Live deployment confirmed by Admin",
        user?.username || user?.userName || "Admin"
      );
      handleCloseModal();
      if (onLiveSuccess) onLiveSuccess();
    } catch (err) {
      alert(err.message || "Failed to mark as live");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "success.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RocketLaunchIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6">Confirm Live Deployment</Typography>
        </Box>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.primary" gutterBottom>
          Deploy <strong>"{taskDetail?.title}"</strong> to Live Environment?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Testing for this task has passed successfully. Confirming live deployment will mark this ticket as <strong>Closed</strong> and update the production deployment record with your Admin stamp and timestamp.
        </Typography>
        <TextField
          label="Deployment Remarks / Release Version"
          fullWidth
          size="small"
          multiline
          rows={3}
          placeholder="e.g. Deployed in Release v2.4. Tested and verified in production."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseModal} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmLive}
          variant="contained"
          color="success"
          disabled={deploying}
          startIcon={<RocketLaunchIcon />}
        >
          {deploying ? "Deploying..." : "Confirm Live & Close Ticket"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const TestingCompleteModal = ({
  openModal,
  handleCloseModal,
  taskDetail,
  onCompleteSuccess,
}) => {
  const user = useSelector(selectUser);
  const [remarks, setRemarks] = useState("");
  const [completing, setCompleting] = useState(false);

  const handleConfirmTesting = async () => {
    try {
      setCompleting(true);
      await apiService.testingCompleted(
        taskDetail.taskId || taskDetail.id,
        user?.employeeId,
        remarks || "QA Testing verified and passed.",
        user?.email
      );
      handleCloseModal();
      if (onCompleteSuccess) onCompleteSuccess();
    } catch (err) {
      alert(err.message || "Failed to complete testing");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "secondary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6">Complete QA Testing</Typography>
        </Box>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.primary" gutterBottom>
          Task: <strong>{taskDetail?.title}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Please enter your QA verification notes or test summary before marking testing as completed:
        </Typography>
        <TextField
          label="QA Testing Remarks"
          fullWidth
          size="small"
          multiline
          rows={3}
          placeholder="e.g. All test cases passed. Edge cases verified on staging."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseModal} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmTesting}
          variant="contained"
          color="primary"
          disabled={completing}
          startIcon={<CheckCircleIcon />}
        >
          {completing ? "Submitting..." : "Submit Testing Completed"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
