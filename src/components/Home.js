import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  styled,
  Tooltip,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  Badge,
  Popover,
  Divider,
  InputBase,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications,
  NotificationsActive,
  NotificationsNone,
  DoneAll,
  PeopleAlt as ClientIcon,
  Assignment as TaskIcon,
  Mail as MessageIcon,
  Dashboard,
  TrackChanges,
  Add,
  SpatialTracking,
  Security as SecurityIcon,
  Science as ScienceIcon,
  RocketLaunch as RocketLaunchIcon,
  ArrowForward as ArrowForwardIcon,
  CameraAlt as CameraAltIcon,
  Key as KeyIcon,
  Logout as LogoutIcon,
  PersonOutline as PersonOutlineIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
} from "@mui/icons-material";
import CloudIcon from "@mui/icons-material/Cloud";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../globalData/authSlice";
import {
  Calendar,
  Menu as LucideMenu,
  Sun as LucideSun,
  Moon as LucideMoon,
  CloudSun as LucideCloudSun,
  Bell as LucideBell,
  Plus as LucidePlus,
  ChevronDown as LucideChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Cloud,
  Folder,
  Users,
  Sliders,
  Activity,
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  X,
} from "lucide-react";
import WeatherCard from "./widgets/WeatherCard";
import ChangePasswordModal from "./widgets/ChangePasswordModal";
import ProfileModal from "./widgets/ProfileModal";
import apiService from "./services/apiServices";
import { useThemeMode } from "../theme/ThemeContext";

const drawerWidth = 240;

// macOS Traffic Light dots (🔴 🟡 🟢)
const MacTrafficLights = ({ onClose, onMinimize, onMaximize }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      px: 0.5,
      userSelect: "none",
    }}
  >
    <Box
      component="span"
      onClick={onClose}
      title="Close / Toggle"
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: "#ff5f56",
        border: "0.5px solid #e0443e",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { transform: "scale(1.15)", filter: "brightness(1.1)" },
      }}
    />
    <Box
      component="span"
      onClick={onMinimize}
      title="Minimize"
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: "#ffbd2e",
        border: "0.5px solid #dea123",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { transform: "scale(1.15)", filter: "brightness(1.1)" },
      }}
    />
    <Box
      component="span"
      onClick={onMaximize}
      title="Toggle Fullscreen"
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: "#27c93f",
        border: "0.5px solid #1aab29",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { transform: "scale(1.15)", filter: "brightness(1.1)" },
      }}
    />
  </Box>
);

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "openDrawer" && prop !== "isMobile",
})(({ theme, openDrawer, isMobile }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: "100vh",
  padding: isMobile ? theme.spacing(1.8) : theme.spacing(3.5),
  boxSizing: "border-box",
  transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflowX: "hidden",
  width: "100%",
  ...(openDrawer &&
    !isMobile && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})(({ theme, open, isMobile }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    zIndex: 1100,
    borderRadius: 0,
    height: "56px",
    boxSizing: "border-box",
    backgroundColor: isDark
      ? "rgba(18, 18, 24, 0.92)"
      : "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    color: theme.palette.text.primary,
    boxShadow: "none",
    borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0"}`,
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...(open &&
      !isMobile && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
      }),
  };
});

const StyledDrawer = styled(Drawer)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      borderRadius: 0,
      zIndex: theme.zIndex.drawer + 1,
      background: isDark ? "#16161c" : "#f6f7f9",
      borderRight: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}`,
      boxShadow: "none",
      overflow: "hidden",
      overscrollBehavior: "contain",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  };
});

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => {
  const isDark = theme.palette.mode === "dark";

  return {
    cursor: "pointer",
    padding: "7px 12px",
    minHeight: 36,
    margin: "2px 8px",
    width: "calc(100% - 16px)",
    boxSizing: "border-box",
    borderRadius: "8px",
    color: active ? "#ffffff" : isDark ? "#cbd5e1" : "#475569",
    backgroundColor: active ? "#2563eb" : "transparent",
    fontWeight: active ? 600 : 500,
    transition: "all 0.15s ease",
    ...(active && {
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
    }),
    "&:hover": {
      backgroundColor: active
        ? "#1d4ed8"
        : isDark
        ? "rgba(255, 255, 255, 0.06)"
        : "rgba(0, 0, 0, 0.04)",
      color: active ? "#ffffff" : isDark ? "#ffffff" : "#0f172a",
    },
    "& .MuiListItemText-primary": {
      fontWeight: active ? 600 : 500,
      fontSize: "0.84rem",
      letterSpacing: "-0.01em",
      color: "inherit",
    },
    "& .MuiListItemIcon-root, & svg": {
      minWidth: 26,
      color: active ? "#ffffff" : isDark ? "#94a3b8" : "#64748b",
      transition: "color 0.15s ease",
    },
  };
});

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { mode, toggleTheme, isDark } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDrawer, setOpenDrawer] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");

  const getPageTitle = (pathname) => {
    if (pathname === "/" || pathname.includes("/dashboard")) return "System Preferences";
    if (pathname.includes("/task-creation-access")) return "Access Management";
    if (pathname.includes("/createtask")) return "Create New Task";
    if (pathname.includes("/task")) return "Sprint Tasks";
    if (pathname.includes("/tracking")) return "Lifecycle Analytics";
    if (pathname.includes("/daily-tracker")) return "Daily Tracker";
    if (pathname.includes("/status")) return "System Preferences";
    if (pathname.includes("/calendar")) return "Sprint Calendar";
    if (pathname.includes("/team")) return "Team Members";
    return "System Preferences";
  };
  const [openWeather, setOpenWeather] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const fileInputRef = useRef(null);
  const drawerPaperRef = useRef(null);
  const sidebarScrollRef = useRef(null);

  useEffect(() => {
    setOpenDrawer(!isMobile);
  }, [isMobile]);

  // Isolate Sidebar scrolling: wheel/trackpad scroll over sidebar never scrolls main window/screen
  useEffect(() => {
    const el = drawerPaperRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const scrollEl = sidebarScrollRef.current;
      if (scrollEl) {
        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 20;
        else if (e.deltaMode === 2) delta *= scrollEl.clientHeight;

        const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
        if (maxScroll > 0) {
          scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, scrollEl.scrollTop + delta));
        }
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const onTouchMove = (e) => {
      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [openDrawer]);

  const open = Boolean(anchorEl);

  // Notifications State & Logic
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const stored = localStorage.getItem(
        `taskflow_read_notifs_${user?.employeeId || user?.email || "guest"}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const isFetchingNotifRef = useRef(false);
  const userEmpId = user?.employeeId;
  const userEmail = user?.email;
  const userName = user?.username || user?.userName;
  const userType = user?.userType;

  const fetchNotifications = useCallback(async () => {
    if (!userEmpId || isFetchingNotifRef.current) return;
    try {
      isFetchingNotifRef.current = true;
      const data = await apiService.getNotifications({
        userEmpId,
        userEmail,
        userName,
        userType,
      });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // Gracefully set empty notifications on network or server offline
      setNotifications([]);
    } finally {
      isFetchingNotifRef.current = false;
    }
  }, [userEmpId, userEmail, userName, userType]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (n) => !readNotifIds.includes(n.id)
  ).length;

  const handleOpenNotif = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleCloseNotif = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem(
        `taskflow_read_notifs_${user?.employeeId || user?.email || "guest"}`,
        JSON.stringify(allIds)
      );
    } catch {}
  };

  const handleViewTaskFromNotif = (notif) => {
    if (!readNotifIds.includes(notif.id)) {
      const updated = [...readNotifIds, notif.id];
      setReadNotifIds(updated);
      try {
        localStorage.setItem(
          `taskflow_read_notifs_${user?.employeeId || user?.email || "guest"}`,
          JSON.stringify(updated)
        );
      } catch (e) {}
    }
    handleCloseNotif();
    navigate("/task", { state: { openTaskId: notif.taskId } });
  };

  const isAdmin = user?.userType === "Admin";
  const canCreateWork = isAdmin || Boolean(user?.canCreateTask);

  const workspaceNavItems = [
    {
      text: "Overview",
      path: "/dashboard",
      icon: <LayoutDashboard size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Analytics",
      path: "/tracking",
      icon: <Activity size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Projects",
      path: "/task",
      icon: <Folder size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Team Members",
      path: "/team",
      icon: <Users size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Preferences",
      path: "/status",
      icon: <Sliders size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Daily Tracker",
      path: "/daily-tracker",
      icon: <BarChart3 size={17} strokeWidth={2} />,
      visible: true,
    },
    {
      text: "Sprint Calendar",
      path: "/calendar",
      icon: <Calendar size={17} strokeWidth={2} />,
      visible: true,
    },
  ].filter((item) => item.visible);

  const managementNavItems = [
    {
      text: "Create Task",
      path: "/createtask",
      icon: <LucidePlus size={17} strokeWidth={2} />,
      visible: canCreateWork,
    },
    {
      text: "Access Management",
      path: "/task-creation-access",
      icon: <SecurityIcon sx={{ fontSize: 18 }} />,
      visible: isAdmin,
    },
  ].filter((item) => item.visible);

  const filteredWorkspaceItems = workspaceNavItems.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredManagementItems = managementNavItems.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!user) return;
    const savedImage = localStorage.getItem(`profileImage_${user}`);
    if (savedImage) setProfileImage(savedImage);
  }, [user]);

  const getColorFromChar = (char) => {
    if (!char || char.length !== 1) return "#000000";
    const seed = char.charCodeAt(0);
    const random = (n) =>
      Math.floor(Math.abs(Math.sin(seed * n) * 10000) % 256);
    const r = random(1);
    const g = random(2);
    const b = random(3);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const signOut = () => {
    handleMenuClose();
    dispatch(logout());
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("employee");
    navigate("/login");
  };

  const getUserInitial = (name) => name?.charAt(0)?.toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem(`profileImage_${user}`, base64String);
      };
      reader.readAsDataURL(file);
      handleMenuClose();
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setOpenDrawer(false);
    }
  };

  return (
    <>
      <Box display="flex">
        <CssBaseline />

        <StyledAppBar position="fixed" open={openDrawer} isMobile={isMobile}>
          <Toolbar sx={{ height: "56px", minHeight: "56px !important", px: { xs: 1.5, sm: 2.5 }, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Left: Navigation history buttons & Dynamic Title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {(!openDrawer || isMobile) && (
                <IconButton
                  size="small"
                  onClick={handleDrawerToggle}
                  aria-label="Toggle navigation"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    color: theme.palette.text.secondary,
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" },
                  }}
                >
                  <LucideMenu size={17} />
                </IconButton>
              )}

              {/* Back / Forward history arrows */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                <Tooltip title="Back">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => navigate(-1)}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "6px",
                        color: isDark ? "#94a3b8" : "#64748b",
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
                      }}
                    >
                      <ChevronLeft size={18} strokeWidth={2.4} />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Forward">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => navigate(1)}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "6px",
                        color: isDark ? "#94a3b8" : "#64748b",
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
                      }}
                    >
                      <ChevronRight size={18} strokeWidth={2.4} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              {/* Dynamic Page Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "15px", sm: "17px" },
                  letterSpacing: "-0.015em",
                  color: theme.palette.text.primary,
                  ml: 0.8,
                  userSelect: "none",
                }}
              >
                {getPageTitle(location.pathname)}
              </Typography>
            </Box>

            {/* Header Right Actions */}
            {user && (
              <Box display="flex" alignItems="center" gap={{ xs: 0.8, sm: 1.2 }}>
                {/* Live Sync Badge */}
                <Box
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    alignItems: "center",
                    gap: 0.7,
                    px: 1.4,
                    py: 0.45,
                    borderRadius: "20px",
                    bgcolor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
                    border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.28)" : "#a7f3d0"}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                      boxShadow: "0 0 6px #10b981",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 650,
                      color: isDark ? "#34d399" : "#059669",
                      lineHeight: 1,
                    }}
                  >
                    Live Sync
                  </Typography>
                </Box>

                {/* + New Report Action Button */}
                {canCreateWork && (
                  <Button
                    variant="contained"
                    component={Link}
                    to="/createtask"
                    size="small"
                    startIcon={<LucidePlus size={15} strokeWidth={2.4} />}
                    sx={{
                      bgcolor: "#2563eb",
                      color: "#ffffff",
                      textTransform: "none",
                      fontWeight: 650,
                      fontSize: "12.5px",
                      borderRadius: "7px",
                      px: 1.6,
                      py: 0.5,
                      boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                      display: { xs: "none", sm: "inline-flex" },
                      "&:hover": {
                        bgcolor: "#1d4ed8",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                      },
                    }}
                  >
                    New Report
                  </Button>
                )}

                {/* Modern Dark & Light Mode Switcher */}
                <Tooltip
                  title={
                    isDark
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"
                  }
                >
                  <IconButton
                    onClick={toggleTheme}
                    aria-label="Toggle theme mode"
                    sx={{
                      bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(241, 245, 249, 0.7)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(226, 232, 240, 0.9)",
                        transform: "translateY(-1px)",
                        boxShadow: isDark
                          ? "0 2px 10px rgba(0, 0, 0, 0.3)"
                          : "0 2px 10px rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    {isDark ? (
                      <LucideSun size={18} strokeWidth={2} style={{ color: "#fbbf24", filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.5))" }} />
                    ) : (
                      <LucideMoon size={18} strokeWidth={2} style={{ color: "#6366f1", filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))" }} />
                    )}
                  </IconButton>
                </Tooltip>

                {/* Weather Action */}
                <Tooltip title="Weather & Environment">
                  <IconButton
                    onClick={() => setOpenWeather(true)}
                    aria-label="Weather information"
                    sx={{
                      bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(241, 245, 249, 0.7)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(226, 232, 240, 0.9)",
                        transform: "translateY(-1px)",
                        boxShadow: isDark
                          ? "0 2px 10px rgba(0, 0, 0, 0.3)"
                          : "0 2px 10px rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    <LucideCloudSun
                      size={19}
                      strokeWidth={2}
                      style={{
                        color: isDark ? "#38bdf8" : "#0284c7",
                        filter: isDark ? "drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))" : "none",
                      }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Notifications Bell */}
                <Tooltip
                  title={
                    unreadCount > 0
                      ? `${unreadCount} new task notification(s)`
                      : "Notifications"
                  }
                >
                  <IconButton
                    onClick={handleOpenNotif}
                    aria-label="Notifications"
                    sx={{
                      bgcolor: Boolean(notifAnchorEl)
                        ? isDark
                          ? "rgba(37, 99, 235, 0.2)"
                          : "#eff6ff"
                        : isDark
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(241, 245, 249, 0.7)",
                      border: Boolean(notifAnchorEl)
                        ? `1px solid ${theme.palette.primary.main}`
                        : `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(226, 232, 240, 0.9)",
                        transform: "translateY(-1px)",
                        boxShadow: isDark
                          ? "0 2px 10px rgba(0, 0, 0, 0.3)"
                          : "0 2px 10px rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      max={99}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          fontWeight: 800,
                          height: 18,
                          minWidth: 18,
                          borderRadius: "9px",
                          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          boxShadow: "0 2px 6px rgba(239, 68, 68, 0.45)",
                        },
                      }}
                    >
                      <LucideBell
                        size={19}
                        strokeWidth={2}
                        style={{
                          color: unreadCount > 0
                            ? (isDark ? "#38bdf8" : "#2563eb")
                            : (isDark ? "#94a3b8" : "#64748b"),
                        }}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Notifications Popover */}
                <Popover
                  open={Boolean(notifAnchorEl)}
                  anchorEl={notifAnchorEl}
                  onClose={handleCloseNotif}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      width: { xs: "92vw", sm: 420 },
                      maxHeight: 520,
                      borderRadius: "12px",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                      boxShadow: isDark
                        ? "0 25px 60px -10px rgba(0, 0, 0, 0.75)"
                        : "0 20px 40px -10px rgba(15, 23, 42, 0.14)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      mt: 1.5,
                      bgcolor: isDark
                        ? "rgba(22, 22, 28, 0.96)"
                        : "rgba(255, 255, 255, 0.96)",
                      backdropFilter: "blur(24px) saturate(180%)",
                    },
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      p: 2,
                      px: 2.5,
                      bgcolor: isDark ? "rgba(35, 35, 45, 0.85)" : "#ffffff",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          fontSize: "1.05rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Notifications
                      </Typography>
                      {unreadCount > 0 ? (
                        <Chip
                          label={`${unreadCount} New`}
                          size="small"
                          sx={{
                            bgcolor: isDark
                              ? "rgba(10, 132, 255, 0.2)"
                              : "#eff6ff",
                            color: isDark ? "#409cff" : "#0071e3",
                            fontWeight: 750,
                            fontSize: "11px",
                            height: 22,
                            border: `1px solid ${
                              isDark
                                ? "rgba(10, 132, 255, 0.35)"
                                : "#bfdbfe"
                            }`,
                          }}
                        />
                      ) : (
                        <Chip
                          label="All Read"
                          size="small"
                          sx={{
                            bgcolor: isDark
                              ? "rgba(255, 255, 255, 0.06)"
                              : "#f1f5f9",
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            fontSize: "11px",
                            height: 22,
                          }}
                        />
                      )}
                    </Box>

                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        onClick={handleMarkAllRead}
                        startIcon={<DoneAll fontSize="small" />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 650,
                          fontSize: "12px",
                          color: isDark ? "#409cff" : "#0071e3",
                          "&:hover": {
                            bgcolor: isDark
                              ? "rgba(10, 132, 255, 0.12)"
                              : "rgba(0, 113, 227, 0.08)",
                          },
                        }}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </Box>

                  {/* Notification Items List */}
                  <Box
                    sx={{
                      overflowY: "auto",
                      flexGrow: 1,
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.2,
                      maxHeight: 380,
                    }}
                  >
                    {notifications.length === 0 ? (
                      <Box
                        sx={{
                          py: 6,
                          px: 3,
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: isDark
                              ? "rgba(255, 255, 255, 0.05)"
                              : "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1.5,
                          }}
                        >
                          <NotificationsNone
                            sx={{
                              fontSize: 28,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                          }}
                        >
                          All caught up! 🎉
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            mt: 0.5,
                            maxWidth: 240,
                          }}
                        >
                          No active task assignments or pending actions for your
                          account right now.
                        </Typography>
                      </Box>
                    ) : (
                      notifications.map((notif) => {
                        const isUnread = !readNotifIds.includes(notif.id);
                        const isDev = notif.type === "dev_assignment";
                        const isQa = notif.type === "qa_assignment";

                        return (
                          <Box
                            key={notif.id}
                            onClick={() => handleViewTaskFromNotif(notif)}
                            sx={{
                              p: 1.8,
                              borderRadius: 0,
                              border: isUnread
                                ? isDark
                                  ? "1.5px solid rgba(10, 132, 255, 0.45)"
                                  : "1.5px solid #bfdbfe"
                                : `1px solid ${theme.palette.divider}`,
                              bgcolor: isUnread
                                ? isDark
                                  ? "rgba(10, 132, 255, 0.12)"
                                  : "#f8fafc"
                                : isDark
                                ? "rgba(255, 255, 255, 0.03)"
                                : "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              position: "relative",
                              "&:hover": {
                                bgcolor: isDark
                                  ? "rgba(10, 132, 255, 0.18)"
                                  : "#eff6ff",
                                transform: "translateY(-1px)",
                                boxShadow: isDark
                                  ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                                  : "0 4px 12px rgba(37, 99, 235, 0.08)",
                              },
                            }}
                          >
                            {isUnread && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 14,
                                  right: 14,
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: isDark ? "#0a84ff" : "#0071e3",
                                  boxShadow: `0 0 0 3px ${
                                    isDark
                                      ? "rgba(10, 132, 255, 0.3)"
                                      : "rgba(0, 113, 227, 0.2)"
                                  }`,
                                }}
                              />
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: 0,
                                  bgcolor: isDev
                                    ? isDark
                                      ? "rgba(10, 132, 255, 0.15)"
                                      : "#eff6ff"
                                    : isQa
                                    ? isDark
                                      ? "rgba(191, 90, 242, 0.15)"
                                      : "#f5f3ff"
                                    : isDark
                                    ? "rgba(255, 159, 10, 0.15)"
                                    : "#fffbeb",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {isDev ? (
                                  <TaskIcon
                                    sx={{
                                      color: isDark ? "#409cff" : "#0071e3",
                                      fontSize: 20,
                                    }}
                                  />
                                ) : isQa ? (
                                  <ScienceIcon
                                    sx={{
                                      color: isDark ? "#bf5af2" : "#8944ab",
                                      fontSize: 20,
                                    }}
                                  />
                                ) : (
                                  <RocketLaunchIcon
                                    sx={{
                                      color: isDark ? "#ff9f0a" : "#d97706",
                                      fontSize: 20,
                                    }}
                                  />
                                )}
                              </Box>

                              <Box
                                sx={{
                                  flexGrow: 1,
                                  minWidth: 0,
                                  pr: isUnread ? 2 : 0,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0.5,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Chip
                                    label={notif.role || "Task"}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: "9.5px",
                                      fontWeight: 700,
                                      bgcolor: isDev
                                        ? isDark
                                          ? "rgba(10, 132, 255, 0.2)"
                                          : "#dbeafe"
                                        : isQa
                                        ? isDark
                                          ? "rgba(191, 90, 242, 0.2)"
                                          : "#ede9fe"
                                        : isDark
                                        ? "rgba(255, 159, 10, 0.2)"
                                        : "#fef3c7",
                                      color: isDev
                                        ? isDark
                                          ? "#409cff"
                                          : "#1d4ed8"
                                        : isQa
                                        ? isDark
                                          ? "#bf5af2"
                                          : "#6d28d9"
                                        : isDark
                                        ? "#ff9f0a"
                                        : "#b45309",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "11px",
                                    }}
                                  >
                                    {new Date(
                                      notif.timestamp
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 750,
                                    color: theme.palette.text.primary,
                                    fontSize: "0.925rem",
                                    lineHeight: 1.35,
                                    mb: 0.4,
                                  }}
                                  noWrap
                                >
                                  #{notif.taskId} {notif.taskTitle}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    display: "block",
                                    mb: 0.8,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {notif.message}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mt: 0.8,
                                    pt: 0.5,
                                    borderTop: `1px dashed ${theme.palette.divider}`,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "11px",
                                    }}
                                  >
                                    By: <strong>{notif.assignedBy}</strong> •
                                    Priority: <strong>{notif.priority}</strong>
                                  </Typography>
                                  <Button
                                    size="small"
                                    endIcon={
                                      <ArrowForwardIcon sx={{ fontSize: 13 }} />
                                    }
                                    sx={{
                                      fontSize: "11px",
                                      fontWeight: 750,
                                      p: 0,
                                      minWidth: "auto",
                                      textTransform: "none",
                                      color: isDark ? "#409cff" : "#0071e3",
                                    }}
                                  >
                                    View Task
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })
                    )}
                  </Box>

                  {/* Footer */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: isDark ? "rgba(35, 35, 45, 0.85)" : "#f8fafc",
                      borderTop: `1px solid ${theme.palette.divider}`,
                      textAlign: "center",
                    }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => {
                        handleCloseNotif();
                        navigate("/task");
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: theme.palette.text.secondary,
                        "&:hover": { color: isDark ? "#409cff" : "#0071e3" },
                      }}
                    >
                      View All Sprint Tasks →
                    </Button>
                  </Box>
                </Popover>

                {/* User Profile Card */}
                <Box
                  onClick={handleMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    cursor: "pointer",
                    py: 0.5,
                    px: { xs: 0.6, sm: 1.2 },
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(241, 245, 249, 0.7)",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(226, 232, 240, 0.9)",
                      transform: "translateY(-1px)",
                      boxShadow: isDark
                        ? "0 2px 10px rgba(0, 0, 0, 0.3)"
                        : "0 2px 10px rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={profileImage || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: profileImage
                          ? "transparent"
                          : getColorFromChar(
                              user?.username?.at(0) || user?.userName?.at(0)
                            ),
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      }}
                    >
                      {!profileImage &&
                        getUserInitial(user?.username || user?.userName)}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#10b981",
                        border: `1.5px solid ${isDark ? "#121218" : "#fff"}`,
                        boxShadow: "0 0 4px #10b981",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: { xs: "none", sm: "block" },
                      textAlign: "left",
                      lineHeight: 1.2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: "13px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {user?.username || user?.userName || "Team User"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? "#60a5fa" : "#2563eb",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      {isAdmin
                        ? `Admin • ${user?.designation || "Head"}`
                        : user?.designation || "Employee"}
                    </Typography>
                  </Box>

                  <LucideChevronDown
                    size={14}
                    strokeWidth={2.2}
                    style={{
                      color: isDark ? "#94a3b8" : "#64748b",
                      marginLeft: "2px",
                    }}
                  />
                </Box>

                {/* Premium Profile Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      width: 290,
                      borderRadius: "12px",
                      boxShadow: isDark
                        ? "0 20px 50px -10px rgba(0, 0, 0, 0.75)"
                        : "0 20px 40px -10px rgba(15, 23, 42, 0.16)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                      p: 1.2,
                      overflow: "hidden",
                      mt: 1.5,
                      bgcolor: isDark
                        ? "rgba(22, 22, 28, 0.96)"
                        : "rgba(255, 255, 255, 0.96)",
                      backdropFilter: "blur(24px) saturate(180%)",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* User Profile Header Card */}
                  <Box
                    sx={{
                      p: 1.8,
                      bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "#f8fafc",
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.divider}`,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={profileImage || undefined}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: profileImage
                            ? "transparent"
                            : getColorFromChar(
                                user?.username?.at(0) || user?.userName?.at(0)
                              ),
                          fontSize: "16px",
                          fontWeight: 750,
                          color: "#fff",
                          border: "2px solid #ffffff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        {!profileImage &&
                          getUserInitial(user?.username || user?.userName)}
                      </Avatar>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "#34c759",
                          border: "2px solid #fff",
                        }}
                      />
                    </Box>

                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          fontSize: "14px",
                          lineHeight: 1.25,
                        }}
                        noWrap
                      >
                        {user?.username || user?.userName || "Team User"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "11.5px",
                          display: "block",
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                        noWrap
                      >
                        {user?.email || "user@dasher.io"}
                      </Typography>
                      <Chip
                        label={
                          isAdmin
                            ? `Admin • ${user?.designation || "Head"}`
                            : user?.designation || "Employee"
                        }
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "10.5px",
                          fontWeight: 700,
                          bgcolor: isDark
                            ? "rgba(10, 132, 255, 0.2)"
                            : "#eff6ff",
                          color: isDark ? "#409cff" : "#1d4ed8",
                          border: `1px solid ${
                            isDark
                              ? "rgba(10, 132, 255, 0.35)"
                              : "#bfdbfe"
                          }`,
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider
                    sx={{ my: 0.8, borderColor: theme.palette.divider }}
                  />

                  {/* Edit Profile Details */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setOpenProfileModal(true);
                    }}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.25,
                      my: 0.2,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(10, 132, 255, 0.12)"
                          : "rgba(0, 113, 227, 0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "6px",
                        bgcolor: isDark
                          ? "rgba(10, 132, 255, 0.15)"
                          : "#eff6ff",
                        color: isDark ? "#409cff" : "#0071e3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                        border: `1px solid ${
                          isDark ? "rgba(10, 132, 255, 0.3)" : "#bfdbfe"
                        }`,
                        flexShrink: 0,
                      }}
                    >
                      <PersonOutlineIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 650,
                          color: theme.palette.text.primary,
                          lineHeight: 1.2,
                        }}
                      >
                        Edit Profile
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "11px",
                        }}
                      >
                        Update mail, gender, role
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Change Avatar */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      triggerFileSelect();
                    }}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.25,
                      my: 0.2,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(10, 132, 255, 0.12)"
                          : "rgba(79, 70, 229, 0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "6px",
                        bgcolor: isDark
                          ? "rgba(10, 132, 255, 0.15)"
                          : "#eef2ff",
                        color: isDark ? "#409cff" : "#4f46e5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                        border: `1px solid ${
                          isDark ? "rgba(10, 132, 255, 0.3)" : "#e0e7ff"
                        }`,
                        flexShrink: 0,
                      }}
                    >
                      <CameraAltIcon sx={{ fontSize: 17 }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 650,
                          color: theme.palette.text.primary,
                          lineHeight: 1.2,
                        }}
                      >
                        Change Avatar
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "11px",
                        }}
                      >
                        Update your photo
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Change Password */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setOpenPasswordModal(true);
                    }}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.25,
                      my: 0.2,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(191, 90, 242, 0.12)"
                          : "rgba(147, 51, 234, 0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "6px",
                        bgcolor: isDark
                          ? "rgba(191, 90, 242, 0.15)"
                          : "#faf5ff",
                        color: isDark ? "#bf5af2" : "#9333ea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                        border: `1px solid ${
                          isDark ? "rgba(191, 90, 242, 0.3)" : "#f3e8ff"
                        }`,
                        flexShrink: 0,
                      }}
                    >
                      <KeyIcon sx={{ fontSize: 17 }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 650,
                          color: theme.palette.text.primary,
                          lineHeight: 1.2,
                        }}
                      >
                        Change Password
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "11px",
                        }}
                      >
                        Verify & set new password
                      </Typography>
                    </Box>
                  </MenuItem>

                  <Divider
                    sx={{ my: 0.8, borderColor: theme.palette.divider }}
                  />

                  {/* Sign Out */}
                  <MenuItem
                    onClick={signOut}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1.25,
                      my: 0.2,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: isDark
                          ? "rgba(255, 69, 58, 0.15)"
                          : "#fef2f2",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "6px",
                        bgcolor: isDark
                          ? "rgba(255, 69, 58, 0.18)"
                          : "#fee2e2",
                        color: isDark ? "#ff453a" : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1.5,
                        border: `1px solid ${
                          isDark ? "rgba(255, 69, 58, 0.3)" : "#fecaca"
                        }`,
                        flexShrink: 0,
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 17 }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: isDark ? "#ff453a" : "#ef4444",
                          lineHeight: 1.2,
                        }}
                      >
                        Sign Out
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark ? "#ff6961" : "#991b1b",
                          fontSize: "11px",
                        }}
                      >
                        End active session
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>

                {/* Change Password Modal */}
                <ChangePasswordModal
                  open={openPasswordModal}
                  onClose={() => setOpenPasswordModal(false)}
                  user={user}
                  onSuccessRedirect={signOut}
                />

                {/* Edit Profile Modal */}
                <ProfileModal
                  isOpen={openProfileModal}
                  setIsOpen={setOpenProfileModal}
                />

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>
            )}
          </Toolbar>
        </StyledAppBar>

        {/* Sidebar Drawer */}
        <StyledDrawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={openDrawer}
          onClose={handleDrawerClose}
          PaperProps={{
            ref: drawerPaperRef,
            sx: {
              overscrollBehavior: "contain",
            },
          }}
        >
          <Box
            ref={sidebarScrollRef}
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              flexGrow: 1,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
                borderRadius: "4px",
              },
              "&:hover::-webkit-scrollbar-thumb": {
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1",
              },
            }}
          >
            {/* Top Row: 🔴 🟡 🟢 Traffic Lights & WORKSPACE */}
            <Box
              sx={{
                height: "56px",
                minHeight: "56px",
                maxHeight: "56px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}`,
              }}
            >
              <MacTrafficLights
                onClose={handleDrawerToggle}
                onMinimize={handleDrawerToggle}
                onMaximize={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
              />
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: isDark ? "#64748b" : "#94a3b8",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                WORKSPACE
              </Typography>
            </Box>

            {/* Sidebar Search Bar */}
            <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.2,
                  py: 0.55,
                  borderRadius: "8px",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0"}`,
                  boxShadow: isDark ? "none" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.15s ease",
                  "&:focus-within": {
                    borderColor: "#2563eb",
                    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.15)",
                  },
                }}
              >
                <Search size={14} style={{ color: isDark ? "#94a3b8" : "#94a3b8", flexShrink: 0 }} />
                <InputBase
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    fontSize: "12.5px",
                    color: theme.palette.text.primary,
                    width: "100%",
                    "& input": { p: 0 },
                    "& input::placeholder": {
                      color: isDark ? "#64748b" : "#94a3b8",
                      opacity: 1,
                    },
                  }}
                />
                {searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ p: 0.2 }}>
                    <X size={12} style={{ color: theme.palette.text.secondary }} />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Section: FAVORITES */}
            <Box sx={{ px: 2, pt: 1, pb: 0.4 }}>
              <Typography
                sx={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: isDark ? "#64748b" : "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                FAVORITES
              </Typography>
            </Box>

            <List sx={{ pt: 0.2, px: 0 }}>
              {filteredWorkspaceItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.includes(item.path));
                return (
                  <StyledListItem
                    key={item.text}
                    component={Link}
                    to={item.path}
                    disablePadding
                    active={isActive}
                    onClick={handleDrawerClose}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1.2 }}>
                      {item.icon}
                    </Box>
                    <ListItemText primary={item.text} />
                  </StyledListItem>
                );
              })}
            </List>

            {/* Management Section (Admin / Task Creator) */}
            {filteredManagementItems.length > 0 && (
              <>
                <Box sx={{ px: 2, pt: 1.5, pb: 0.4 }}>
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: isDark ? "#64748b" : "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    MANAGEMENT
                  </Typography>
                </Box>

                <List sx={{ pt: 0.2, px: 0 }}>
                  {filteredManagementItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                      <StyledListItem
                        key={item.text}
                        component={Link}
                        to={item.path}
                        disablePadding
                        active={isActive}
                        onClick={handleDrawerClose}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mr: 1.2 }}>
                          {item.icon}
                        </Box>
                        <ListItemText primary={item.text} />
                      </StyledListItem>
                    );
                  })}
                </List>
              </>
            )}
          </Box>

          {/* Drawer Bottom Widget: Apple iCloud+ / Workspace Cloud Card */}
          <Box sx={{ p: 1.5, flexShrink: 0, borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e5e7eb"}` }}>
            <Box
              sx={{
                p: 1.4,
                borderRadius: "10px",
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0"}`,
                boxShadow: isDark ? "none" : "0 1px 3px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Cloud size={16} style={{ color: "#2563eb", fill: "#2563eb" }} />
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: theme.palette.text.primary }}>
                    iCloud+
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: theme.palette.text.secondary }}>
                  1.4 / 2 TB
                </Typography>
              </Box>
              {/* Apple Dual-Tone Progress Bar */}
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  borderRadius: 2,
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "70%",
                    height: "100%",
                    borderRadius: 2,
                    bgcolor: "#2563eb",
                  }}
                />
              </Box>
            </Box>
          </Box></StyledDrawer>

        <MainContent openDrawer={openDrawer} isMobile={isMobile}>
          <Toolbar sx={{ height: "56px", minHeight: "56px !important" }} />
          <Outlet />
        </MainContent>
      </Box>
      <WeatherCard open={openWeather} setOpen={setOpenWeather} />
    </>
  );
};

export default Home;
