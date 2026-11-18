import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  Typography,
  Box,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip as MuiTooltip,
  Button,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../globalData/authSlice";
import {
  RefreshCw,
  Layers,
  CheckCircle2,
  Clock,
  Rocket,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import ProfileModal from "./widgets/ProfileModal";
import { useTheme } from "@mui/material/styles";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiService from "./services/apiServices";

// Apple macOS Vibrant Color Tokens
const APPLE_COLORS = {
  blue: "#0071e3",
  indigo: "#5856d6",
  purple: "#af52de",
  teal: "#30b0c7",
  green: "#34c759",
  orange: "#ff9500",
  red: "#ff3b30",
};

const CHART_COLORS = [
  "#0071e3",
  "#5856d6",
  "#34c759",
  "#ff9500",
  "#af52de",
  "#30b0c7",
];

const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const user = useSelector(selectUser);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamPerformanceData, setTeamPerformanceData] = useState([]);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarDetails, setAvatarDetails] = useState({
    name: "",
    position: "",
    image: null,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        apiService.getDashboardStats().catch(() => null),
        apiService.getTask().catch(() => []),
      ]);

      if (statsRes?.teamPerformance) {
        setTeamPerformanceData(statsRes.teamPerformance);
      }

      if (Array.isArray(tasksRes)) {
        setData(tasksRes);
      }
    } catch (err) {
      // Graceful error handling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const prioritySummary = useMemo(() => {
    const summary = { High: 0, Medium: 0, Low: 0 };
    data.forEach((task) => {
      if (task.priority && summary[task.priority] !== undefined) {
        summary[task.priority] += 1;
      }
    });
    return {
      total: data.length,
      summary,
    };
  }, [data]);

  const statusData = useMemo(() => {
    const map = {};
    data.forEach((task) => {
      const s = task.status || "Unassigned";
      map[s] = (map[s] || 0) + 1;
    });
    const result = Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
    return result.length > 0 ? result : [{ name: "No Tasks", value: 1 }];
  }, [data]);

  const stats = useMemo(
    () => [
      {
        label: "Sprint Total",
        value: data.length,
        subtext: "Active Sprint Scope",
        color: APPLE_COLORS.blue,
        icon: Layers,
      },
      {
        label: "In Progress",
        value: data.filter((t) =>
          ["Assigned", "Work In Progress", "In Progress"].includes(t.status)
        ).length,
        subtext: "Under Active Dev",
        color: APPLE_COLORS.orange,
        icon: Clock,
      },
      {
        label: "QA Verification",
        value: data.filter((t) =>
          [
            "Development Completed",
            "Testing Assigned",
            "Testing In Progress",
            "Testing Completed",
          ].includes(t.status)
        ).length,
        subtext: "Quality Assurance",
        color: APPLE_COLORS.purple,
        icon: CheckCircle2,
      },
      {
        label: "Live Deployed",
        value: data.filter((t) =>
          ["Live Deployed", "Completed", "Closed"].includes(t.status)
        ).length,
        subtext: "Shipped to Production",
        color: APPLE_COLORS.green,
        icon: Rocket,
      },
    ],
    [data]
  );

  const handleOpenProfile = (member, profile) => {
    setAvatarDetails({
      name: member.name,
      position: member.position,
      image: profile || member.avatarSrc,
    });
    setTimeout(() => {
      setAvatarOpen(true);
    }, 150);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", pb: 5 }}>
      {/* macOS Top Glass Bar Header */}
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
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
            <Chip
              label={
                user?.userType === "Admin"
                  ? `Admin Lead • ${user?.designation || "Head"}`
                  : user?.designation || "Team Member"
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
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 750,
              color: theme.palette.text.primary,
              letterSpacing: "-0.025em",
              fontSize: { xs: "1.4rem", md: "1.75rem" },
            }}
          >
            Sprint Dashboard
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.4 }}
          >
            Real-time telemetry across engineering sprints, QA milestones, and production deployments.
          </Typography>
        </Box>

        {/* macOS Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            component={Link}
            to="/task"
            size="small"
            endIcon={<ArrowUpRight size={14} />}
          >
            Sprint Work Items
          </Button>

          <Button
            variant="contained"
            component={Link}
            to="/tracking"
            size="small"
            color="primary"
          >
            Lifecycle Tracking
          </Button>

          <MuiTooltip title="Refresh Dashboard">
            <span>
              <IconButton
                onClick={fetchDashboardData}
                size="small"
                disabled={loading}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "10px",
                  width: 36,
                  height: 36,
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </IconButton>
            </span>
          </MuiTooltip>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={32} sx={{ color: isDark ? "#0a84ff" : "#0071e3" }} />
        </Box>
      ) : (
        <>
          {/* macOS 4-Stat Metric Cards */}
          <Grid container spacing={2.2} sx={{ mb: 3 }}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Card
                  elevation={0}
                  sx={{
                    p: 2.4,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "14px",
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      borderColor: stat.color,
                      transform: "translateY(-2px)",
                      boxShadow: isDark
                        ? "0 8px 24px rgba(0, 0, 0, 0.45)"
                        : "0 8px 20px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 650,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontSize: "11px",
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight={750}
                      sx={{
                        color: theme.palette.text.primary,
                        mt: 0.5,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.color,
                        fontWeight: 650,
                        mt: 0.8,
                        display: "block",
                      }}
                    >
                      {stat.subtext}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: `${stat.color}18`,
                      border: `1px solid ${stat.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}
                  >
                    <stat.icon size={22} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Analytics Grid */}
          <Grid container spacing={2.5}>
            {/* Team Performance Table */}
            <Grid item xs={12} lg={7}>
              <Card
                elevation={0}
                sx={{
                  p: 2.8,
                  height: "100%",
                  borderRadius: "16px",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ color: theme.palette.text.primary, letterSpacing: "-0.015em" }}
                    >
                      Team Velocity & Performance
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Live progress and completion metrics per engineer
                    </Typography>
                  </Box>
                  <Chip
                    label={`${teamPerformanceData.length} Members`}
                    size="small"
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.06)"
                        : "rgba(0, 0, 0, 0.04)",
                    }}
                  />
                </Box>

                <TableContainer
                  sx={{
                    maxHeight: 360,
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Engineer</TableCell>
                        <TableCell align="center">Assigned</TableCell>
                        <TableCell align="center">Completed</TableCell>
                        <TableCell align="center">Pending</TableCell>
                        <TableCell align="right">Completion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamPerformanceData.length > 0 ? (
                        teamPerformanceData.map((member, index) => {
                          const profileImage =
                            member.avatarSrc ||
                            localStorage.getItem(`profileImage_${member.name}`);
                          const rate = member.completionRate || 0;

                          return (
                            <TableRow
                              key={member.id || index}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                  <Avatar
                                    src={profileImage || undefined}
                                    sx={{
                                      bgcolor:
                                        CHART_COLORS[index % CHART_COLORS.length],
                                      width: 32,
                                      height: 32,
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenProfile(member, profileImage)
                                    }
                                  >
                                    {!profileImage &&
                                      (member.name ? member.name[0].toUpperCase() : "U")}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={650}
                                      sx={{ fontSize: "13px", lineHeight: 1.2 }}
                                    >
                                      {member.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "11px",
                                      }}
                                    >
                                      {member.position || "Developer"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>

                              <TableCell align="center" sx={{ fontWeight: 600 }}>
                                {member.assigned}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  color: theme.palette.success.main,
                                  fontWeight: 700,
                                }}
                              >
                                {member.completed}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  color: theme.palette.warning.main,
                                  fontWeight: 700,
                                }}
                              >
                                {member.pending}
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: 1,
                                  }}
                                >
                                  <LinearProgress
                                    variant="determinate"
                                    value={rate}
                                    sx={{
                                      width: 75,
                                      height: 6,
                                      borderRadius: 3,
                                      bgcolor: isDark
                                        ? "rgba(255, 255, 255, 0.08)"
                                        : "rgba(0, 0, 0, 0.06)",
                                      "& .MuiLinearProgress-bar": {
                                        bgcolor:
                                          rate >= 80
                                            ? APPLE_COLORS.green
                                            : rate >= 40
                                            ? APPLE_COLORS.blue
                                            : APPLE_COLORS.orange,
                                        borderRadius: 3,
                                      },
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    sx={{ minWidth: 32, fontSize: "11px" }}
                                  >
                                    {rate}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              No team member workload recorded for active sprint.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Status Distribution Donut Chart */}
            <Grid item xs={12} lg={5}>
              <Card
                elevation={0}
                sx={{
                  p: 2.8,
                  height: "100%",
                  borderRadius: "16px",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: theme.palette.text.primary, letterSpacing: "-0.015em" }}
                  >
                    Sprint Status Distribution
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Proportion of tasks across lifecycle phases
                  </Typography>
                </Box>

                <Box sx={{ height: 260, position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            stroke={theme.palette.background.paper}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark
                            ? "rgba(28, 28, 33, 0.95)"
                            : "rgba(255, 255, 255, 0.95)",
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "10px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                          fontSize: "12px",
                          color: theme.palette.text.primary,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total Count */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{ color: theme.palette.text.primary, lineHeight: 1 }}
                    >
                      {data.length}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "10.5px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Tasks
                    </Typography>
                  </Box>
                </Box>

                {/* macOS Legend Pill Badges */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  {statusData.map((item, idx) => (
                    <Box
                      key={item.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1,
                        py: 0.4,
                        borderRadius: "8px",
                        bgcolor: isDark
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.03)",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: CHART_COLORS[idx % CHART_COLORS.length],
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.name}: <strong>{item.value}</strong>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Priority Distribution Cards */}
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 1.5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Sprint Tasks by Priority
                </Typography>

                <Grid container spacing={2.2}>
                  {[
                    {
                      label: "High Priority",
                      key: "High",
                      color: APPLE_COLORS.red,
                      subtext: "Critical & blocker items",
                    },
                    {
                      label: "Medium Priority",
                      key: "Medium",
                      color: APPLE_COLORS.orange,
                      subtext: "Sprint feature roadmap",
                    },
                    {
                      label: "Low Priority",
                      key: "Low",
                      color: APPLE_COLORS.green,
                      subtext: "Maintenance & minor chores",
                    },
                  ].map((p) => {
                    const count = prioritySummary.summary[p.key] || 0;
                    const percent =
                      prioritySummary.total > 0
                        ? ((count / prioritySummary.total) * 100).toFixed(0)
                        : "0";

                    return (
                      <Grid item xs={12} sm={4} key={p.key}>
                        <Card
                          elevation={0}
                          sx={{
                            p: 2.2,
                            borderRadius: "14px",
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderTop: `3.5px solid ${p.color}`,
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              sx={{
                                color: p.color,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                                fontSize: "11px",
                              }}
                            >
                              {p.label}
                            </Typography>
                            <Chip
                              label={`${percent}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "10.5px",
                                fontWeight: 700,
                                bgcolor: `${p.color}15`,
                                color: p.color,
                                border: `1px solid ${p.color}35`,
                              }}
                            />
                          </Box>

                          <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                              color: theme.palette.text.primary,
                              letterSpacing: "-0.02em",
                              my: 0.5,
                            }}
                          >
                            {count}
                          </Typography>

                          <LinearProgress
                            variant="determinate"
                            value={Number(percent)}
                            sx={{
                              my: 1.2,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: isDark
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.06)",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: p.color,
                                borderRadius: 3,
                              },
                            }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "11.5px",
                            }}
                          >
                            {p.subtext}
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* Profile Modal */}
      <ProfileModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        details={avatarDetails}
      />
    </Box>
  );
};

export default Dashboard;
