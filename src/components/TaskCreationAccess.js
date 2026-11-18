import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SecurityIcon from "@mui/icons-material/Security";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSelector } from "react-redux";
import { selectUser } from "../globalData/authSlice";
import apiService from "./services/apiServices";

const TaskCreationAccess = () => {
  const user = useSelector(selectUser);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [employees, setEmployees] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAccessList = useCallback(async () => {
    if (!user?.employeeId) return;

    try {
      setLoading(true);
      const res = await apiService.getEmployeesAccess(user.employeeId);
      setAdminInfo(res.admin || null);
      setEmployees(res.employees || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.error || err.message || "Failed to load employees list",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccessList();
  }, [fetchAccessList]);

  const handleToggle = async (employee, currentStatus) => {
    const newStatus = !currentStatus;
    setUpdatingId(employee.employeeId);

    try {
      const res = await apiService.toggleTaskCreation({
        employeeId: employee.employeeId,
        canCreateTask: newStatus,
        adminEmpId: user.employeeId,
      });

      setSnackbar({
        open: true,
        message:
          res.message ||
          `Task creation permission ${newStatus ? "granted" : "revoked"}!`,
        severity: "success",
      });

      // Update state locally
      setEmployees((prev) =>
        prev.map((e) =>
          e.employeeId === employee.employeeId
            ? { ...e, canCreateTask: newStatus }
            : e
        )
      );
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.error || err.message || "Failed to update permission",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.userType !== "Admin") {
    return (
      <Card
        elevation={0}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: "16px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          mt: 3,
        }}
      >
        <Typography variant="h6" fontWeight={750} color="#ef4444">
          Access Restricted
        </Typography>
        <Typography variant="body2" color="#64748b" mt={1}>
          Only authorized Development and Testing Administrators can manage employee task creation permissions.
        </Typography>
      </Card>
    );
  }

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

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
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
              <SecurityIcon fontSize="small" />
            </Box>
            <Typography
              variant="h5"
              fontWeight={850}
              color={theme.palette.text.primary}
              sx={{ letterSpacing: "-0.02em", fontSize: { xs: "1.35rem", sm: "1.6rem" } }}
            >
              Task Creation Governance
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5, fontSize: "0.9rem" }}>
            Authorize team members under your supervision to create tasks and sprint backlog items.
          </Typography>
        </Box>

        <Tooltip title="Refresh Access List">
          <span>
            <IconButton
              onClick={fetchAccessList}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "10px",
                width: 38,
                height: 38,
                "&:hover": { bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f8fafc" },
              }}
              disabled={loading}
            >
              <RefreshIcon sx={{ color: theme.palette.text.primary, fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Admin Scope Card with 3-Color Gradient Styling */}
      {adminInfo && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: "16px",
            background: isDark ? "linear-gradient(145deg, #1c1c24 0%, #1a2729 50%, #1e1e2f 100%)" : "linear-gradient(145deg, #ffffff 0%, #f0fdfa 50%, #eef2ff 100%)",
            border: `1px solid ${isDark ? "rgba(99, 102, 241, 0.3)" : "#c7d2fe"}`,
            boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 2px 8px rgba(79, 70, 229, 0.05)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <AdminPanelSettingsIcon sx={{ color: "#4f46e5", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color={theme.palette.text.primary}>
              Managing Lead: {adminInfo.name} ({adminInfo.designation})
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700 }}>
              YOUR MAPPED ROLES:
            </Typography>
            {adminInfo.managedRoles && adminInfo.managedRoles.length > 0 ? (
              adminInfo.managedRoles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "11px",
                    bgcolor: "#faf5ff",
                    color: "#9333ea",
                    border: "1px solid #e9d5ff",
                    height: 22,
                  }}
                />
              ))
            ) : (
              <Chip
                label="All Department Roles"
                size="small"
                sx={{
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                  height: 22,
                  fontSize: "11px",
                }}
              />
            )}
          </Box>
        </Card>
      )}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress size={32} sx={{ color: "#4f46e5" }} />
        </Box>
      ) : isMobile ? (
        /* Mobile Cards Stack */
        <Stack spacing={2}>
          {employees.length > 0 ? (
            employees.map((emp) => {
              const hasPermission = Boolean(emp.canCreateTask);
              const isUpdating = updatingId === emp.employeeId;

              return (
                <Card
                  key={emp.employeeId}
                  elevation={0}
                  sx={{
                    p: 2.2,
                    borderRadius: "14px",
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.3)" : "0 2px 4px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Avatar
                        src={emp.avatarSrc || undefined}
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: "12px",
                          fontWeight: 700,
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        {emp.name ? emp.name[0].toUpperCase() : "E"}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 750, fontSize: "14px", color: theme.palette.text.primary }}>
                          {emp.name}
                        </Typography>
                        <Typography sx={{ fontSize: "11.5px", color: "#64748b" }}>
                          ID: {emp.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={emp.position || "Engineer"}
                      size="small"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 650,
                        bgcolor: "#faf5ff",
                        color: "#9333ea",
                        border: "1px solid #e9d5ff",
                      }}
                    />
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    pt={1.5}
                    borderTop="1px solid #f1f5f9"
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.8,
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "16px",
                        bgcolor: hasPermission ? "#ecfdf5" : "#f1f5f9",
                        color: hasPermission ? "#047857" : "#64748b",
                        border: `1px solid ${hasPermission ? "#a7f3d0" : "#e2e8f0"}`,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: hasPermission ? "#10b981" : "#94a3b8",
                        }}
                      />
                      {hasPermission ? "Permission Granted" : "Restricted"}
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={hasPermission}
                        disabled={isUpdating}
                        onChange={() => handleToggle(emp, hasPermission)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#10b981",
                            "&:hover": {
                              backgroundColor: "rgba(16, 185, 129, 0.08)",
                            },
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#10b981",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11.5px",
                          color: isUpdating
                            ? "#64748b"
                            : hasPermission
                            ? "#059669"
                            : "#64748b",
                        }}
                      >
                        {isUpdating ? "Saving..." : hasPermission ? "Allowed" : "Off"}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })
          ) : (
            <Typography color="#64748b" align="center" sx={{ py: 4 }}>
              No team members found under your lead scope.
            </Typography>
          )}
        </Stack>
      ) : (
        /* Desktop Enterprise SaaS Table */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            overflowX: "auto",
            bgcolor: theme.palette.background.paper,
            boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc" }}>
              <TableRow>
                {[
                  "Team Member",
                  "Employee ID",
                  "Role / Designation",
                  "Email Address",
                  "Access State",
                  "Grant / Revoke",
                ].map((col, idx) => (
                  <TableCell
                    key={col}
                    align={idx === 5 ? "center" : "left"}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                      px: 2.5,
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.length > 0 ? (
                employees.map((emp) => {
                  const hasPermission = Boolean(emp.canCreateTask);
                  const isUpdating = updatingId === emp.employeeId;

                  return (
                    <TableRow
                      key={emp.employeeId}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: isDark ? "rgba(255, 255, 255, 0.04) !important" : "#f8fafc !important" },
                        "& td": { borderBottom: `1px solid ${theme.palette.divider}` },
                      }}
                    >
                      {/* Member Avatar & Name */}
                      <TableCell sx={{ py: 1.8, px: 2.5 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            src={emp.avatarSrc || undefined}
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "12px",
                              fontWeight: 700,
                              bgcolor: "#eef2ff",
                              color: "#4f46e5",
                              border: "1px solid #c7d2fe",
                            }}
                          >
                            {emp.name ? emp.name[0].toUpperCase() : "E"}
                          </Avatar>
                          <Typography sx={{ fontWeight: 650, fontSize: "13.5px", color: "#0f172a" }}>
                            {emp.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Employee ID */}
                      <TableCell sx={{ py: 1.8, px: 2.5 }}>
                        <Chip
                          label={emp.employeeId}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "11px",
                            fontWeight: 700,
                            bgcolor: "#f1f5f9",
                            color: "#334155",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </TableCell>

                      {/* Role */}
                      <TableCell sx={{ py: 1.8, px: 2.5 }}>
                        <Typography sx={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                          {emp.position || "Engineer"}
                        </Typography>
                      </TableCell>

                      {/* Email */}
                      <TableCell sx={{ py: 1.8, px: 2.5, color: "#64748b", fontSize: "13px" }}>
                        {emp.email || "-"}
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 1.8, px: 2.5 }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 1.2,
                            py: 0.4,
                            borderRadius: "16px",
                            bgcolor: hasPermission ? "#ecfdf5" : "#f1f5f9",
                            color: hasPermission ? "#047857" : "#64748b",
                            border: `1px solid ${hasPermission ? "#a7f3d0" : "#e2e8f0"}`,
                            fontSize: "11.5px",
                            fontWeight: 700,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: hasPermission ? "#10b981" : "#94a3b8",
                            }}
                          />
                          {hasPermission ? "Granted" : "Restricted (Default)"}
                        </Box>
                      </TableCell>

                      {/* Toggle Switch */}
                      <TableCell align="center" sx={{ py: 1.8, px: 2.5 }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          gap={1}
                        >
                          <Switch
                            checked={hasPermission}
                            disabled={isUpdating}
                            onChange={() => handleToggle(emp, hasPermission)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#10b981",
                                "&:hover": {
                                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                                },
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#10b981",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              fontSize: "11.5px",
                              minWidth: "60px",
                              color: isUpdating
                                ? "#64748b"
                                : hasPermission
                                ? "#059669"
                                : "#64748b",
                            }}
                          >
                            {isUpdating
                              ? "Saving..."
                              : hasPermission
                              ? "Allowed"
                              : "Restricted"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="#64748b" sx={{ fontSize: "13px" }}>
                      No team members currently found mapped under your organizational lead scope.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TaskCreationAccess;
