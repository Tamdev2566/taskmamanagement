import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  LinearProgress,
  Avatar,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import { selectEmployee } from "../globalData/authSlice";
import { useSelector } from "react-redux";
import apiService from "./services/apiServices";

export default function DailyTracker() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const employee = useSelector(selectEmployee);

  const [tasks, setTasks] = useState([]);
  const [todayHours, setTodayHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingTaskId, setSavingTaskId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchDailyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const empId = employee?.employeeId;
      const res = await apiService.getStatusList(empId);

      const list = Array.isArray(res) ? res : [];
      const filtered = list.filter((t) => {
        if (empId) {
          return (t.employeeId === empId || t.id === empId);
        }
        return Boolean(t.startDate);
      });

      setTasks(filtered);
    } catch (err) {
      // Gracefully handle daily tracker load without console error
    } finally {
      setLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    fetchDailyTasks();
  }, [fetchDailyTasks]);

  const handleSave = async (taskId) => {
    const enteredHours = parseFloat(todayHours[taskId] || 0);
    if (isNaN(enteredHours) || enteredHours <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter valid logged hours greater than 0",
        severity: "warning",
      });
      return;
    }

    try {
      setSavingTaskId(taskId);
      const targetTask = tasks.find((t) => t.taskId === taskId);
      const empId = targetTask?.employeeId || targetTask?.id || employee?.employeeId;

      const res = await apiService.logDailyHours(taskId, empId, enteredHours);
      setSnackbar({
        open: true,
        message: res.message || "Hours logged successfully!",
        severity: "success",
      });

      setTodayHours((prev) => ({ ...prev, [taskId]: "" }));
      fetchDailyTasks();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to log daily hours",
        severity: "error",
      });
    } finally {
      setSavingTaskId(null);
    }
  };

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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3.5}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1.2}>
            <Box
              sx={{
                p: 0.8,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                color: "#ffffff",
                display: "flex",
              }}
            >
              <AccessTimeFilledIcon fontSize="small" />
            </Box>
            <Typography
              variant="h5"
              fontWeight={850}
              color="#0f172a"
              sx={{ letterSpacing: "-0.02em", fontSize: { xs: "1.35rem", sm: "1.6rem" } }}
            >
              Daily Timesheet Tracker
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5, fontSize: "0.9rem" }}>
            Log and audit daily hours invested into assigned sprint tasks and features.
          </Typography>
        </Box>

        <Tooltip title="Refresh Tracker">
          <span>
            <IconButton
              onClick={fetchDailyTasks}
              disabled={loading}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "10px",
                width: 38,
                height: 38,
                "&:hover": { bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f8fafc" },
              }}
            >
              <RefreshIcon sx={{ color: "#475569", fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={32} sx={{ color: "#4f46e5" }} />
        </Box>
      ) : tasks.length === 0 ? (
        <Card sx={{ p: 5, textAlign: "center", borderRadius: "16px", bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} elevation={0}>
          <Typography variant="h6" color={theme.palette.text.primary} fontWeight={750}>
            No active tasks found for tracking today.
          </Typography>
          <Typography variant="body2" color="#64748b" mt={1}>
            Make sure your tasks have been assigned and started in the Task Status page to begin logging time.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => {
            const estHours = parseFloat(task.estimatedHours || 8);
            const logged = parseFloat(task.loggedHours || 0);
            const progress = Math.min(Math.round((logged / estHours) * 100), 100);

            return (
              <Grid item xs={12} md={6} key={task.taskId}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: `1px solid ${isDark ? "rgba(99, 102, 241, 0.3)" : "#c7d2fe"}`,
                    background: isDark ? "linear-gradient(145deg, #1c1c24 0%, #25223a 100%)" : "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
                    boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 2px 8px rgba(79, 70, 229, 0.06)",
                    bgcolor: theme.palette.background.paper,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: "#9333ea",
                      boxShadow: "0 6px 20px rgba(147, 51, 234, 0.12)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <Avatar
                        src={task.avatarSrc || undefined}
                        alt={task.name}
                        sx={{
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 750,
                          width: 40,
                          height: 40,
                          fontSize: "14px",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        {task.name ? task.name[0].toUpperCase() : "U"}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={750}
                          color={theme.palette.text.primary}
                          noWrap
                          sx={{ fontSize: "1rem" }}
                        >
                          {task.taskTitle}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                          {task.name} • {task.position} • <strong>#{task.taskId}</strong>
                        </Typography>
                      </Box>
                      <Chip
                        label={task.taskStatus || "In Progress"}
                        size="small"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          bgcolor: task.taskStatus === "Completed" ? "#ecfdf5" : "#eef2ff",
                          color: task.taskStatus === "Completed" ? "#047857" : "#4338ca",
                          border: `1px solid ${task.taskStatus === "Completed" ? "#a7f3d0" : "#c7d2fe"}`,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#475569" }}>
                        Est: <strong>{estHours} hrs</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#4f46e5" }}>
                        Logged: <strong>{logged} hrs</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#0d9488" }}>
                        Remaining: <strong>{task.estimatedRemainingHours || `${Math.max(estHours - logged, 0)} hrs`}</strong>
                      </Typography>
                    </Box>

                    <Box mb={2.5}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e2e8f0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg, #4f46e5 0%, #9333ea 50%, #10b981 100%)",
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "block",
                          textAlign: "right",
                          mt: 0.5,
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        {progress}% Completed
                      </Typography>
                    </Box>

                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Hours to Log Today"
                          variant="outlined"
                          size="small"
                          value={todayHours[task.taskId] || ""}
                          onChange={(e) =>
                            setTodayHours({
                              ...todayHours,
                              [task.taskId]: e.target.value,
                            })
                          }
                          inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                          placeholder="e.g. 4.5"
                          InputProps={{
                            sx: { borderRadius: "8px", bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff", fontSize: "13px" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={savingTaskId === task.taskId}
                          onClick={() => handleSave(task.taskId)}
                          sx={{
                            borderRadius: "10px",
                            height: 40,
                            fontWeight: 700,
                            textTransform: "none",
                            background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                            color: "#ffffff",
                            boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
                            },
                          }}
                        >
                          {savingTaskId === task.taskId ? "Saving..." : "Log Hours"}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
