import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { selectEmployee } from "../globalData/authSlice";
import apiService from "./services/apiServices";

const EstimatedTimeModal = ({ open, onClose, data, updateDuration }) => {
  const [time, setTime] = useState("");

  const setHandleTime = () => {
    if (!time.match(/^\d{1,2}:\d{2}$/)) {
      alert("Please enter the time in hh:mm format (e.g., 05:30)");
      return;
    }
    updateDuration(data, time);
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      setTime(data.duration || "");
    } else {
      setTime("");
    }
  }, [open, data]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.2)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pb: 1, fontSize: "1.15rem" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              p: 0.8,
              borderRadius: "8px",
              bgcolor: "#eff6ff",
              color: "#2563eb",
              display: "flex",
            }}
          >
            <AccessTimeIcon fontSize="small" />
          </Box>
          Estimated Time
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
          Task #{data.taskId}: <strong>{data.taskTitle || "Task"}</strong>
          <br />
          Set the expected delivery duration in <strong>hours:minutes</strong> format.
        </Typography>
        <TextField
          label="Estimated Duration (hh:mm)"
          placeholder="e.g. 04:30"
          variant="outlined"
          fullWidth
          size="small"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 650,
            borderRadius: "8px",
            color: "#64748b",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={setHandleTime}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "8px",
            bgcolor: "#0f172a",
            color: "#ffffff",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1e293b" },
          }}
        >
          Save Duration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TaskStatus = () => {
  const employee = useSelector(selectEmployee);

  const [taskStatus, setTaskStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchStatusList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getStatusList();
      setTaskStatus(Array.isArray(res) ? res : []);
    } catch (err) {
      // Gracefully handle status load without console error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusList();
  }, [fetchStatusList]);

  const handleTime = (member) => {
    setData(member);
    setOpen(true);
  };

  const updateDuration = async (member, time) => {
    try {
      const res = await apiService.setTaskTime(
        member.taskId,
        member.employeeId || member.id,
        time
      );
      setSnackbar({
        open: true,
        message: res.message || "Estimated time updated!",
        severity: "success",
      });
      fetchStatusList();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update duration",
        severity: "error",
      });
    }
  };

  const handleStart = async (mem) => {
    try {
      const res = await apiService.startTask(
        mem.taskId,
        mem.employeeId || mem.id
      );
      setSnackbar({
        open: true,
        message: res.message || "Task started!",
        severity: "info",
      });
      fetchStatusList();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to start task",
        severity: "error",
      });
    }
  };

  const handleComplete = async (mem) => {
    try {
      const res = await apiService.completeTask(
        mem.taskId,
        mem.employeeId || mem.id
      );
      setSnackbar({
        open: true,
        message: res.message || "Task stage updated successfully!",
        severity: "success",
      });
      fetchStatusList();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update task",
        severity: "error",
      });
    }
  };

  const renderStatusBadge = (status) => {
    let bg = "#f1f5f9";
    let text = "#475569";
    let border = "#e2e8f0";
    let dot = "#94a3b8";
    let label = status || "Unassigned";

    switch (status) {
      case "Assigned":
        bg = "#fffbeb";
        text = "#b45309";
        border = "#fde68a";
        dot = "#f59e0b";
        label = "Assigned";
        break;
      case "In Progress":
      case "Work In Progress":
        bg = "#eff6ff";
        text = "#1d4ed8";
        border = "#bfdbfe";
        dot = "#3b82f6";
        label = "In Progress";
        break;
      case "Developing Completed":
      case "Development Completed":
        bg = "#faf5ff";
        text = "#7e22ce";
        border = "#e9d5ff";
        dot = "#a855f7";
        label = "Dev Completed";
        break;
      case "Testing Assigned":
        bg = "#ecfeff";
        text = "#0e7490";
        border = "#a5f3fc";
        dot = "#06b6d4";
        label = "QA Assigned";
        break;
      case "Testing In Progress":
        bg = "#f0fdf4";
        text = "#15803d";
        border = "#bbf7d0";
        dot = "#22c55e";
        label = "QA In Progress";
        break;
      case "Testing Completed":
        bg = "#eef2ff";
        text = "#4338ca";
        border = "#c7d2fe";
        dot = "#6366f1";
        label = "QA Passed";
        break;
      case "Completed":
      case "Closed":
        bg = "#ecfdf5";
        text = "#047857";
        border = "#a7f3d0";
        dot = "#10b981";
        label = "Closed";
        break;
      default:
        break;
    }

    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.8,
          px: 1.2,
          py: 0.4,
          borderRadius: "16px",
          bgcolor: bg,
          color: text,
          border: `1px solid ${border}`,
          fontSize: "11.5px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: dot,
          }}
        />
        {label}
      </Box>
    );
  };

  const filteredTasks = taskStatus.filter((t) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (t.name || "").toLowerCase().includes(term);
    const titleMatch = (t.taskTitle || "").toLowerCase().includes(term);
    const taskIdMatch = String(t.taskId || "").includes(term);
    const empIdMatch = String(t.employeeId || t.id || "").includes(term);

    const matchesSearch =
      searchTerm === "" || nameMatch || titleMatch || taskIdMatch || empIdMatch;
    const matchesFilter =
      statusFilter === "" || t.taskStatus === statusFilter;

    return matchesSearch && matchesFilter;
  });

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

      {/* Page Title & Stats Toolbar */}
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
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                p: 0.8,
                borderRadius: "10px",
                bgcolor: isDark
                  ? "rgba(10, 132, 255, 0.18)"
                  : "rgba(0, 113, 227, 0.1)",
                color: isDark ? "#409cff" : "#0071e3",
                display: "flex",
              }}
            >
              <AssignmentTurnedInIcon fontSize="small" />
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color={theme.palette.text.primary}
              sx={{ letterSpacing: "-0.02em" }}
            >
              Sprint Task Status
            </Typography>
            <Chip
              label={`${filteredTasks.length} Active`}
              size="small"
              sx={{
                height: 22,
                fontSize: "11px",
                fontWeight: 700,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.04)",
                color: theme.palette.text.secondary,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Real-time delivery progress, estimated effort tracking, and stage handoffs.
          </Typography>
        </Box>

        <Tooltip title="Refresh Status List">
          <span>
            <Button
              onClick={fetchStatusList}
              disabled={loading}
              startIcon={<RefreshIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                textTransform: "none",
                fontWeight: 650,
                fontSize: "13px",
                color: theme.palette.text.primary,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "10px",
                px: 2,
                py: 0.7,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                  borderColor: isDark ? "#409cff" : "#0071e3",
                },
              }}
            >
              Refresh
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Filter and Search Bar Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "14px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            placeholder="Search by name, task ID, title, or employee ID..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 19 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "10px",
                fontSize: "13.5px",
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.02)",
                "& fieldset": { borderColor: theme.palette.divider },
                "&:hover fieldset": { borderColor: isDark ? "#409cff" : "#0071e3" },
                "&.Mui-focused fieldset": {
                  borderColor: isDark ? "#0a84ff" : "#0071e3",
                },
              },
            }}
            sx={{ flexGrow: 1, maxWidth: { sm: 420 } }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label" sx={{ fontSize: "13px" }}>
              Filter by Pipeline Status
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filter by Pipeline Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                borderRadius: "10px",
                fontSize: "13px",
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.02)",
                "& fieldset": { borderColor: theme.palette.divider },
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Developing Completed">Dev Completed</MenuItem>
              <MenuItem value="Testing Assigned">QA Assigned</MenuItem>
              <MenuItem value="Testing Completed">QA Completed</MenuItem>
              <MenuItem value="Completed">Completed / Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={32} sx={{ color: "#2563eb" }} />
        </Box>
      ) : isMobile ? (
        /* Mobile Cards Layout */
        <Stack spacing={2}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((member, index) => {
              const currentEmpId = employee?.employeeId;
              const isActionAllowed =
                !currentEmpId ||
                member.employeeId === currentEmpId ||
                member.id === currentEmpId;

              return (
                <Card
                  key={`card-${member.employeeId || member.id}-${member.taskId}-${index}`}
                  elevation={0}
                  sx={{
                    borderRadius: "14px",
                    border: `1px solid ${theme.palette.divider}`,
                    p: 2.2,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.3)" : "0 2px 4px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.2}>
                    <Box>
                      <Chip
                        label={`#${member.taskId}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "10px",
                          fontWeight: 750,
                          bgcolor: "#f1f5f9",
                          color: "#334155",
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="subtitle2" fontWeight={750} color={theme.palette.text.primary}>
                        {member.taskTitle}
                      </Typography>
                    </Box>
                    {renderStatusBadge(member.taskStatus)}
                  </Box>

                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1 }}>
                    Assignee: <strong>{member.name}</strong> ({member.position}) • ID: {member.employeeId || member.id}
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, my: 1.5, p: 1.5, bgcolor: "#f8fafc", borderRadius: "10px" }}>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Duration: <strong>{member.duration || "Not set"}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Started: <strong>{member.startDate || "-"}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Assigned: <strong>{member.assignedDateWithTime || "-"}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Completed: <strong>{member.completedDate || "-"}</strong>
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                    {member.taskStatus !== "Completed" && !member.startDate && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PlayCircleOutlineIcon />}
                        onClick={() => handleStart(member)}
                        disabled={!isActionAllowed}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 650,
                          borderColor: "#bfdbfe",
                          color: "#1d4ed8",
                          "&:hover": { bgcolor: "#eff6ff" },
                        }}
                      >
                        Start
                      </Button>
                    )}

                    {member.taskStatus !== "Completed" && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AccessTimeIcon />}
                        disabled={!isActionAllowed}
                        onClick={() => handleTime(member)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 650,
                          borderColor: "#e2e8f0",
                          color: "#334155",
                          "&:hover": { bgcolor: "#f1f5f9" },
                        }}
                      >
                        Set Time
                      </Button>
                    )}

                    {Boolean(member.startDate) && member.taskStatus !== "Completed" && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleOutlineIcon />}
                        disabled={!isActionAllowed}
                        onClick={() => handleComplete(member)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                          color: "#ffffff",
                          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.45)",
                          },
                        }}
                      >
                        Advance / Done
                      </Button>
                    )}
                  </Box>
                </Card>
              );
            })
          ) : (
            <Typography align="center" color="textSecondary" sx={{ mt: 5 }}>
              No tasks found matching your criteria.
            </Typography>
          )}
        </Stack>
      ) : (
        /* Desktop Enterprise SaaS Table */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: "70vh",
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            overflowX: "auto",
            overflowY: "auto",
            bgcolor: theme.palette.background.paper,
            boxShadow: isDark
              ? "0 4px 20px rgba(0, 0, 0, 0.4)"
              : "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Table stickyHeader size="small" sx={{ minWidth: "1150px" }}>
            <TableHead>
              <TableRow>
                {[
                  "S.NO",
                  "Task",
                  "Assignee",
                  "Role / Designation",
                  "Pipeline Status",
                  "Estimated Time",
                  "Assigned Date",
                  "Start Date",
                  "Completed Date",
                  "Workflow Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align={header === "Workflow Actions" ? "center" : "left"}
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(28, 28, 33, 0.95)"
                        : "rgba(245, 245, 247, 0.95)",
                      color: theme.palette.text.secondary,
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                      px: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((member, index) => {
                  const currentEmpId = employee?.employeeId;
                  const isActionAllowed =
                    !currentEmpId ||
                    member.employeeId === currentEmpId ||
                    member.id === currentEmpId;

                  return (
                    <TableRow
                      key={`row-${member.employeeId || member.id}-${member.taskId}-${index}`}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: isDark
                            ? "rgba(255, 255, 255, 0.04) !important"
                            : "rgba(0, 0, 0, 0.02) !important",
                        },
                        "& td": { borderBottom: `1px solid ${theme.palette.divider}` },
                      }}
                    >
                      <TableCell sx={{ fontSize: "12px", color: theme.palette.text.secondary, py: 1.6, px: 2, fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>

                      {/* Task ID & Title */}
                      <TableCell sx={{ py: 1.6, px: 2, maxWidth: 280 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <Chip
                            label={`#${member.taskId}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "10.5px",
                              fontWeight: 750,
                              bgcolor: isDark
                                ? "rgba(255, 255, 255, 0.06)"
                                : "rgba(0, 0, 0, 0.04)",
                              color: theme.palette.text.primary,
                              border: `1px solid ${theme.palette.divider}`,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 650,
                              color: theme.palette.text.primary,
                              fontSize: "13px",
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {member.taskTitle}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Assignee */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              fontSize: "11px",
                              fontWeight: 700,
                              bgcolor: isDark
                                ? "rgba(10, 132, 255, 0.18)"
                                : "rgba(0, 113, 227, 0.1)",
                              color: isDark ? "#409cff" : "#0071e3",
                              border: `1px solid ${isDark ? "rgba(10, 132, 255, 0.3)" : "rgba(0, 113, 227, 0.2)"}`,
                            }}
                          >
                            {member.name ? member.name[0].toUpperCase() : "U"}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 650, fontSize: "13px", color: theme.palette.text.primary, lineHeight: 1.2 }}>
                              {member.name}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: theme.palette.text.secondary }}>
                              ID: {member.employeeId || member.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Position */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Typography sx={{ fontSize: "12.5px", color: theme.palette.text.secondary, fontWeight: 500 }}>
                          {member.position || "-"}
                        </Typography>
                      </TableCell>

                      {/* Pipeline Status */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        {renderStatusBadge(member.taskStatus)}
                      </TableCell>

                      {/* Estimated Time */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: member.duration ? theme.palette.text.primary : theme.palette.text.disabled,
                          }}
                        >
                          {member.duration ? `${member.duration} hrs` : "—"}
                        </Typography>
                      </TableCell>

                      {/* Assigned Date */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                          {member.assignedDateWithTime || "-"}
                        </Typography>
                      </TableCell>

                      {/* Start Date */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                          {member.startDate || "-"}
                        </Typography>
                      </TableCell>

                      {/* Completed Date */}
                      <TableCell sx={{ py: 1.6, px: 2 }}>
                        <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                          {member.completedDate || "-"}
                        </Typography>
                      </TableCell>

                      {/* Workflow Actions */}
                      <TableCell align="center" sx={{ py: 1.6, px: 2, whiteSpace: "nowrap" }}>
                        <Box sx={{ display: "inline-flex", gap: 1 }}>
                          {member.taskStatus !== "Completed" && !member.startDate && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlayCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
                              onClick={() => handleStart(member)}
                              disabled={!isActionAllowed}
                              sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                fontSize: "11.5px",
                                fontWeight: 650,
                                borderColor: "#bfdbfe",
                                color: "#1d4ed8",
                                bgcolor: "#eff6ff",
                                py: 0.4,
                                px: 1.2,
                                "&:hover": { bgcolor: "#dbeafe", borderColor: "#93c5fd" },
                              }}
                            >
                              Start
                            </Button>
                          )}

                          {member.taskStatus !== "Completed" && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AccessTimeIcon sx={{ fontSize: "14px !important" }} />}
                              disabled={!isActionAllowed}
                              onClick={() => handleTime(member)}
                              sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                fontSize: "11.5px",
                                fontWeight: 650,
                                borderColor: "#e2e8f0",
                                color: "#334155",
                                py: 0.4,
                                px: 1.2,
                                "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                              }}
                            >
                              Set Time
                            </Button>
                          )}

                          {Boolean(member.startDate) && member.taskStatus !== "Completed" && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
                              disabled={!isActionAllowed}
                              onClick={() => handleComplete(member)}
                              sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                fontSize: "11.5px",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                                color: "#ffffff",
                                boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                                py: 0.4,
                                px: 1.4,
                                "&:hover": {
                                  background: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
                                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.45)",
                                },
                              }}
                            >
                              Advance / Done
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Box sx={{ maxWidth: 360, mx: "auto" }}>
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        No active sprint tasks found
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5, fontSize: "13px" }}>
                        Assign tasks from the sprint backlog to see them track in real time.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <EstimatedTimeModal
        open={open}
        onClose={() => setOpen(false)}
        data={data}
        updateDuration={updateDuration}
      />
    </Box>
  );
};

export default TaskStatus;
