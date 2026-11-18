import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CodeIcon from "@mui/icons-material/Code";
import LayersIcon from "@mui/icons-material/Layers";
import StorageIcon from "@mui/icons-material/Storage";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import apiService from "./services/apiServices";
import ProfileModal from "./widgets/ProfileModal";

const femaleAvatars = [
  "/assets/teams/female_logo_1.jpg",
  "/assets/teams/female_logo_2.jpg",
  "/assets/teams/female_logo_3.jpg",
  "/assets/teams/female_logo_4.jpg",
  "/assets/teams/female_logo_5.jpg",
];

const maleAvatars = [
  "/assets/teams/male_logo_1.jpg",
  "/assets/teams/male_logo_2.jpg",
  "/assets/teams/male_logo_3.jpg",
  "/assets/teams/male_logo_4.jpg",
  "/assets/teams/male_logo_5.jpg",
];

let femaleIndex = 0;
let maleIndex = 0;

const getAvatarInOrder = (gender) => {
  let avatarArray, index;

  if (gender === "Female") {
    avatarArray = femaleAvatars;
    index = femaleIndex;
    femaleIndex = (femaleIndex + 1) % avatarArray.length;
  } else {
    avatarArray = maleAvatars;
    index = maleIndex;
    maleIndex = (maleIndex + 1) % avatarArray.length;
  }

  return avatarArray[index];
};

const getRoleIcon = (role) => {
  const r = (role || "").toLowerCase();
  if (r.includes("front")) return <CodeIcon sx={{ fontSize: 18, color: "#4f46e5" }} />;
  if (r.includes("back")) return <StorageIcon sx={{ fontSize: 18, color: "#0891b2" }} />;
  if (r.includes("full")) return <LayersIcon sx={{ fontSize: 18, color: "#7c3aed" }} />;
  if (r.includes("qa") || r.includes("test")) return <BugReportIcon sx={{ fontSize: 18, color: "#d97706" }} />;
  if (r.includes("devops") || r.includes("cloud")) return <CloudQueueIcon sx={{ fontSize: 18, color: "#2563eb" }} />;
  return <GroupsIcon sx={{ fontSize: 18, color: "#4f46e5" }} />;
};

const TeamMemberCard = ({ member, handleEdit, handleDelete, theme, index, headName }) => {
  const isDark = theme.palette.mode === "dark";
  const avatarSrc = member.avatarSrc;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: `1.5px solid ${theme.palette.divider}`,
        borderTop: `3.5px solid ${isDark ? "#818cf8" : "#6366f1"}`,
        boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 3px 10px rgba(15, 23, 42, 0.05)",
        bgcolor: theme.palette.background.paper,
        transition: "all 0.2s ease-in-out",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark ? "0 8px 24px rgba(99, 102, 241, 0.25)" : "0 8px 20px -3px rgba(99, 102, 241, 0.15)",
          borderColor: isDark ? "rgba(129, 140, 248, 0.4)" : "#c7d2fe",
          borderTopColor: isDark ? "#a5b4fc" : "#4f46e5",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 2,
          pb: 1,
          flexGrow: 1,
          alignItems: "center",
          position: "relative",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack sx={{ flexGrow: 1, minWidth: 0, pr: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3, flexWrap: "wrap", gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.secondary,
                fontSize: "11px",
              }}
            >
              ID: {member.id}
            </Typography>
            {headName && (
              <Chip
                label={`↓ Reports to ${headName.split(" ")[0]}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "9.5px",
                  fontWeight: 700,
                  bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "#eef2ff",
                  color: isDark ? "#a5b4fc" : "#4338ca",
                  border: `1px solid ${isDark ? "rgba(99, 102, 241, 0.3)" : "#c7d2fe"}`,
                }}
              />
            )}
          </Box>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              fontWeight: 750,
              color: theme.palette.text.primary,
              fontSize: "15px",
              lineHeight: 1.2,
              mb: 0.4,
            }}
          >
            {member.name}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: isDark ? "#60a5fa" : theme.palette.primary.dark,
              fontWeight: 650,
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : theme.palette.primary.light + "12",
              border: isDark ? "1px solid rgba(59, 130, 246, 0.2)" : "none",
              display: "inline-block",
              px: 0.8,
              py: 0.3,
              borderRadius: "6px",
              mb: 0.4,
              fontSize: "11px",
              alignSelf: "flex-start",
            }}
          >
            {member.position}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: "text.secondary", fontSize: "11px" }}>
            {member.email}
          </Typography>
        </Stack>

        {avatarSrc && (
          <img
            src={avatarSrc}
            alt="Team Member Avatar"
            style={{
              height: 68,
              width: 68,
              objectFit: "cover",
              borderRadius: "50%",
              border: `2.5px solid ${theme.palette.primary.light}`,
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
              pointerEvents: "none",
              flexShrink: 0,
            }}
          />
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="flex-end"
        sx={{
          px: 1.5,
          py: 0.8,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <Button
          size="small"
          variant="text"
          startIcon={<EditIcon sx={{ fontSize: "15px !important" }} />}
          onClick={() => handleEdit(member)}
          sx={{
            color: theme.palette.primary.main,
            textTransform: "capitalize",
            fontSize: "11.5px",
            py: 0.2,
            "&:hover": {
              backgroundColor: theme.palette.primary.light + "20",
            },
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="text"
          color="error"
          startIcon={<DeleteIcon sx={{ fontSize: "15px !important" }} />}
          onClick={() => handleDelete(member.id)}
          sx={{
            textTransform: "capitalize",
            fontSize: "11.5px",
            py: 0.2,
            "&:hover": {
              backgroundColor: theme.palette.error.light + "20",
            },
          }}
        >
          Delete
        </Button>
      </Stack>
    </Card>
  );
};

const Team = () => {
  const user = useSelector((state) => state.auth.user);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [teamData, setTeamData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({
    id: "",
    name: "",
    position: "",
    email: "",
    gender: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getTeam = useCallback(() => {
    apiService
      .getTeam(user?.employeeId)
      .then((res) => {
        setTeamData(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        // Graceful fallback
      });
  }, [user?.employeeId]);

  const fetchUsers = useCallback(async () => {
    apiService
      .getUsers()
      .then((res) => {
        let list = Array.isArray(res) ? res : [];
        // Only include Employees (exclude Admins)
        list = list.filter((u) => u.userType !== "Admin");

        // Filter by Admin's managedRoles: only show employees whose designation matches this Admin's managed roles
        if (
          user?.userType === "Admin" &&
          Array.isArray(user?.managedRoles) &&
          user.managedRoles.length > 0
        ) {
          list = list.filter((u) => user.managedRoles.includes(u.designation));
        }
        setUsers(list);
      })
      .catch(() => {
        // Graceful fallback
      });
  }, [user]);

  const openDrawer = () => {
    if (editId !== null) {
      setEditId(null);
      setId("");
      setName("");
      setPosition("");
      setEmail("");
      setGender("");
      setErrors({ id: "", name: "", position: "", email: "", gender: "" });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditId(null);
    setId("");
    setName("");
    setPosition("");
    setEmail("");
    setGender("");
    setErrors({ id: "", name: "", position: "", email: "", gender: "" });
  };

  useEffect(() => {
    fetchUsers();
    getTeam();
  }, [fetchUsers, getTeam]);

  // When adding a new member, only show employees who are not already in this team
  const availableUsers = useMemo(() => {
    if (editId !== null) return users;
    const currentMemberIds = new Set(
      teamData.map((m) => (m.employeeId || m.id || "").toLowerCase()),
    );
    return users.filter(
      (u) => u.employeeId && !currentMemberIds.has(u.employeeId.toLowerCase()),
    );
  }, [users, teamData, editId]);

  const designationData = useMemo(
    () =>
      availableUsers.map((item, index) => ({
        label: item.designation,
        id: index + 1,
        user: item,
      })),
    [availableUsers],
  );
  const employeeIdData = useMemo(
    () =>
      availableUsers.map((item, index) => ({
        label: item.employeeId,
        id: index + 1,
        user: item,
      })),
    [availableUsers],
  );
  const mailIdData = useMemo(
    () =>
      availableUsers.map((item, index) => ({
        label: item.email,
        id: index + 1,
        user: item,
      })),
    [availableUsers],
  );
  const nameData = useMemo(
    () =>
      availableUsers.map((item, index) => ({
        label: item.username,
        id: index + 1,
        user: item,
      })),
    [availableUsers],
  );

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const handleFieldChange = (field, value) => {
    const formErrors = { ...errors };

    if (field === "gender") {
      setGender(value);
      formErrors.gender = value.trim() === "" ? "Gender is required" : "";
    }

    setErrors(formErrors);
  };

  /**
   * @param {string} field .
   * @param {string} value - The value to search for.
   * @returns {object | undefined} The matched user object.
   */
  const findUser = (field, value) => {
    if (!value) return undefined;
    const normalizedValue = String(value).toLowerCase();

    switch (field) {
      case "id":
        return users.find(
          (u) => u.employeeId && u.employeeId.toLowerCase() === normalizedValue,
        );
      case "name":
        return users.find(
          (u) => u.username && u.username.toLowerCase() === normalizedValue,
        );
      case "position":
        return users.find(
          (u) =>
            u.designation && u.designation.toLowerCase() === normalizedValue,
        );
      case "email":
        return users.find(
          (u) => u.email && u.email.toLowerCase() === normalizedValue,
        );
      default:
        return undefined;
    }
  };

  const handleUserFieldChange = (field, value) => {
    const selectedValue = value
      ? typeof value === "string"
        ? value
        : value.label
      : "";
    const formErrors = { ...errors };

    switch (field) {
      case "id":
        setId(selectedValue);
        formErrors.id = selectedValue.trim() === "" ? "ID is required" : "";

        if (
          editId === null &&
          selectedValue &&
          teamData.some(
            (member) => (member.employeeId || member.id) === selectedValue,
          )
        ) {
          formErrors.id = "This ID is already taken.";
        }
        break;
      case "name":
        setName(selectedValue);
        formErrors.name = selectedValue.trim() === "" ? "Name is required" : "";
        break;
      case "position":
        setPosition(selectedValue);
        formErrors.position =
          selectedValue.trim() === "" ? "Position is required" : "";
        break;
      case "email":
        setEmail(selectedValue);
        if (!selectedValue.trim()) formErrors.email = "Email is required";
        else if (!isValidEmail(selectedValue))
          formErrors.email = "Please enter a valid email";
        else formErrors.email = "";
        break;
      default:
        break;
    }

    const matchedUser = findUser(field, selectedValue);

    if (matchedUser) {
      setId(matchedUser.employeeId || "");
      setName(matchedUser.username || "");
      setPosition(matchedUser.designation || "");
      setEmail(matchedUser.email || "");
      setGender(matchedUser.gender || "Male");

      formErrors.id = "";
      formErrors.name = "";
      formErrors.position = "";
      formErrors.email = "";
      formErrors.gender = "";
    } else if (selectedValue === "") {
      setId("");
      setName("");
      setPosition("");
      setEmail("");
      setGender("");
    }

    setErrors(formErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {
      id: "",
      name: "",
      position: "",
      email: "",
      gender: "",
    };

    if (!id || !id.trim()) formErrors.id = "ID is required";
    if (!name) formErrors.name = "Name is required";
    if (!position) formErrors.position = "Position is required";
    if (!email) formErrors.email = "Email is required";
    if (email && !isValidEmail(email))
      formErrors.email = "Please enter a valid email";
    if (!gender) formErrors.gender = "Gender is required";

    if (
      editId === null &&
      id &&
      teamData.some((member) => (member.employeeId || member.id) === id)
    ) {
      formErrors.id = "This ID is already taken.";
    }

    if (Object.values(formErrors).some((err) => err !== "")) {
      setErrors(formErrors);
      return;
    }

    let newMemberData = { employeeId: id, id, name, position, email, gender };
    const avatarSrc = getAvatarInOrder(gender);
    newMemberData = { ...newMemberData, avatarSrc };

    try {
      const res = await apiService.postTeam(newMemberData);
      setSnackbar({
        open: true,
        message: res.message || "Team member saved successfully!",
        severity: "success",
      });
      setEditId(null);
      getTeam();
      closeDrawer();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to save team member",
        severity: "error",
      });
    }
  };

  const handleEdit = (member) => {
    const memberId = member.employeeId || member.id;
    // For head, open ProfileModal instead!
    if (memberId === headMember?.id || memberId === headMember?.employeeId) {
      setIsProfileModalOpen(true);
      return;
    }
    setId(memberId);
    setName(member.name);
    setPosition(member.position);
    setEmail(member.email);
    setGender(member.gender || "");
    setEditId(memberId);
    setErrors({ id: "", name: "", position: "", email: "", gender: "" });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (memberId === headMember?.id || memberId === headMember?.employeeId) {
      setSnackbar({
        open: true,
        message: "The Team Head cannot be deleted.",
        severity: "error",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;

    try {
      const res = await apiService.deleteTeam(memberId);
      setSnackbar({
        open: true,
        message: res.message || "Team member removed",
        severity: "success",
      });
      getTeam();
      if (editId === memberId) {
        closeDrawer();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete team member",
        severity: "error",
      });
    }
  };

  // Identify the Team Head
  const headMember = useMemo(() => {
    if (!teamData || teamData.length === 0) return null;
    return (
      teamData.find(
        (m) =>
          (user?.employeeId && (m.employeeId === user.employeeId || m.id === user.employeeId)) ||
          m.userType === "Admin" ||
          (m.position && m.position.toLowerCase().includes("head"))
      ) || teamData.find((m) => m.name === user?.username)
    );
  }, [teamData, user]);

  // Reporting team members (under the Team Head)
  const reportingMembers = useMemo(() => {
    if (!teamData) return [];
    if (!headMember) return teamData;
    return teamData.filter(
      (m) => m.id !== headMember.id && m.employeeId !== headMember.employeeId
    );
  }, [teamData, headMember]);

  // Filter reporting members by search term
  const filteredReportingMembers = useMemo(() => {
    if (!searchTerm.trim()) return reportingMembers;
    const term = searchTerm.toLowerCase();
    return reportingMembers.filter(
      (member) =>
        member.id?.toLowerCase().includes(term) ||
        member.name?.toLowerCase().includes(term) ||
        member.position?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term) ||
        (member.gender && member.gender.toLowerCase().includes(term))
    );
  }, [reportingMembers, searchTerm]);

  // Sort reporting members
  const sortedReportingMembers = useMemo(() => {
    if (!sortConfig.key) return filteredReportingMembers;
    const sorted = [...filteredReportingMembers].sort((a, b) => {
      const aVal = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : "";
      const bVal = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredReportingMembers, sortConfig]);

  // Group reporting members by their Role / Position for Flowchart Pods
  const roleGroups = useMemo(() => {
    const groups = {};
    sortedReportingMembers.forEach((member) => {
      const pos = member.position || "General Role";
      if (!groups[pos]) {
        groups[pos] = [];
      }
      groups[pos].push(member);
    });
    return Object.entries(groups).map(([role, members]) => ({
      role,
      members,
    }));
  }, [sortedReportingMembers]);

  // Check if head matches search term
  const isHeadMatchingSearch = useMemo(() => {
    if (!headMember) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      headMember.id?.toLowerCase().includes(term) ||
      headMember.name?.toLowerCase().includes(term) ||
      headMember.position?.toLowerCase().includes(term) ||
      headMember.email?.toLowerCase().includes(term) ||
      (headMember.gender && headMember.gender.toLowerCase().includes(term))
    );
  }, [headMember, searchTerm]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const SortButton = ({ sortKey, label }) => (
    <Button
      onClick={() => requestSort(sortKey)}
      variant="text"
      size="small"
      endIcon={
        sortConfig.key === sortKey ? (
          sortConfig.direction === "asc" ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )
        ) : null
      }
      sx={{
        fontWeight: 600, // Slightly bolder for all sort buttons
        textTransform: "none",
        color:
          sortConfig.key === sortKey
            ? theme.palette.primary.main // Main primary color for active sort
            : theme.palette.text.secondary,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {label}
    </Button>
  );

  const getAutocompleteValue = (data, value) =>
    data.find((item) => item.label === value) || null;

  if (user && user.userType !== "Admin") {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
          maxWidth: 600,
          mx: "auto",
          mt: 6,
        }}
      >
        <Typography variant="h5" color="error" fontWeight={700} gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          The Team Management screen is restricted to Admin users only.
        </Typography>
        <Button variant="contained" component={Link} to="/dashboard">
          Go to Dashboard
        </Button>
      </Paper>
    );
  }

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

      {/* Header/Add Member Button */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={4}
      >
        <div>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: theme.palette.text.primary, fontSize: { xs: "1.45rem", sm: "1.9rem" }, letterSpacing: "-0.02em" }}
          >
            Team Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Designation: <strong>{user?.designation || "Admin"}</strong> |
            Mapped Roles:{" "}
            <span style={{ color: "#4f46e5", fontWeight: 700 }}>
              {user?.managedRoles?.length > 0
                ? user.managedRoles.join(", ")
                : "All Roles"}
            </span>
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
          onClick={openDrawer}
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
            color: "#ffffff",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.875rem",
            textTransform: "none",
            px: 2.5,
            py: 1,
            boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.45)",
            },
          }}
        >
          Add New Member
        </Button>
      </Stack>

      {/* Drawer Component for Add/Edit */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 450, md: 500 }, // Slightly wider drawer
            p: 4, // Increased padding
            zIndex: theme.zIndex.modal + 1 || 1401,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary, // Darker color for title
            }}
          >
            {editId ? "Edit Team Member" : "Onboard New Member"}
          </Typography>
          <IconButton onClick={closeDrawer} size="medium">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 4 }} />

        <Stack
          component="form"
          onSubmit={handleSubmit}
          spacing={3}
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            // Custom scrollbar style for better aesthetics
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.light,
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          <Autocomplete
            options={employeeIdData}
            getOptionLabel={(option) => option.label || ""}
            value={getAutocompleteValue(employeeIdData, id)}
            onChange={(e, value) => handleUserFieldChange("id", value)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box sx={{ width: "100%", py: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#0f172a" }}
                  >
                    {option.label} — {option.user?.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Mapped Role: <strong>{option.user?.designation}</strong> (
                    {option.user?.email})
                  </Typography>
                </Box>
              </li>
            )}
            disabled={editId !== null}
            size="medium"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee ID (Mapped Role)"
                error={!!errors.id}
                helperText={
                  errors.id || "Select an employee matching your managed roles"
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={nameData}
            getOptionLabel={(option) => option.label || ""}
            value={getAutocompleteValue(nameData, name)}
            onChange={(e, value) => handleUserFieldChange("name", value)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            size="medium"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Full Name"
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={designationData}
            getOptionLabel={(option) => option.label || ""}
            value={getAutocompleteValue(designationData, position)}
            onChange={(e, value) => handleUserFieldChange("position", value)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            size="medium"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Position / Role"
                error={!!errors.position}
                helperText={errors.position}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                }}
              />
            )}
          />

          {/* Work Email Autocomplete */}
          <Autocomplete
            options={mailIdData}
            getOptionLabel={(option) => option.label || ""}
            value={getAutocompleteValue(mailIdData, email)}
            onChange={(e, value) => handleUserFieldChange("email", value)}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            size="medium"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Work Email"
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                }}
              />
            )}
          />

          {/* Gender ToggleGroup */}
          <Stack direction="column" spacing={0.5}>
            <Typography
              variant="subtitle2" // Subtitle2 for label
              sx={{
                fontWeight: 600,
                color: !!errors.gender
                  ? theme.palette.error.main
                  : theme.palette.text.secondary,
              }}
            >
              Gender *
            </Typography>

            <ToggleButtonGroup
              color="primary"
              exclusive
              size="large" // Larger toggle buttons
              value={gender}
              onChange={(e, newGender) =>
                handleFieldChange("gender", newGender || "")
              }
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: `1px solid ${
                  !!errors.gender
                    ? theme.palette.error.main
                    : theme.palette.divider
                }`,
                "& .MuiToggleButton-root": {
                  flex: 1,
                  border: "none",
                  borderRadius: 2, // Rounded ends on the group
                  fontWeight: 600,
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow on selected
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                  "&:not(:last-of-type)": {
                    borderRight: `1px solid ${theme.palette.divider} !important`, // Ensure separation
                  },
                },
              }}
            >
              <ToggleButton value="Male">Male</ToggleButton>
              <ToggleButton value="Female">Female</ToggleButton>
            </ToggleButtonGroup>

            {!!errors.gender && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.gender}
              </Typography>
            )}
          </Stack>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              mt: 5, // Increased top margin
              boxShadow: "0 6px 15px rgba(0,0,0,0.25)", // Stronger button shadow
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              },
            }}
          >
            {editId ? "Update Member" : "Add Member"}
          </Button>
        </Stack>
      </Drawer>
      {/* --- End Drawer Component --- */}

      {/* Search and Sort Controls */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 4,
          borderRadius: "16px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 2px 10px rgba(0, 0, 0, 0.03)",
        }}
      >
        <TextField
          placeholder="Search by ID, Name, Position, Email, or Gender..."
          variant="outlined"
          size="medium" // Medium size search field
          fullWidth
          margin="none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "10px",
              fontSize: "13.5px",
              bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: isDark ? "#409cff" : "#0071e3" },
              "&.Mui-focused fieldset": { borderColor: isDark ? "#0a84ff" : "#0071e3" },
            }
          }}
        />

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ pl: 1, pt: 1 }}
        >
          <Typography
            variant="body1" // Slightly larger sort text
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Sort By:
          </Typography>
          <SortButton sortKey="id" label="ID" />
          <SortButton sortKey="name" label="Name" />
          <SortButton sortKey="position" label="Position" />
          <SortButton sortKey="gender" label="Gender" />
        </Stack>
      </Paper>

      {/* 1. Team Head Card (At the top of the hierarchy - No Edit / Delete here!) */}
      {headMember && isHeadMatchingSearch && (
        <Box sx={{ mb: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Card
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: "800px" },
              borderRadius: "18px",
              border: `1.5px solid ${isDark ? "rgba(124, 58, 237, 0.4)" : "#c7d2fe"}`,
              borderBottom: "3.5px solid #7c3aed",
              background: isDark ? "linear-gradient(135deg, #1c1c24 0%, #20202d 60%, #271e3b 100%)" : "linear-gradient(135deg, #ffffff 0%, #fbfaff 60%, #f5f3ff 100%)",
              boxShadow: isDark ? "0 12px 36px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(124, 58, 237, 0.2)" : "0 12px 32px -8px rgba(99, 102, 241, 0.16)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Top Badge Strip */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.2,
                bgcolor: isDark ? "rgba(124, 58, 237, 0.15)" : "rgba(99, 102, 241, 0.08)",
                borderBottom: `1px solid ${isDark ? "rgba(124, 58, 237, 0.25)" : "rgba(99, 102, 241, 0.15)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  icon={<WorkspacePremiumIcon sx={{ fontSize: "16px !important", color: "#ffffff !important" }} />}
                  label="Team Head / Lead Administrator"
                  size="small"
                  sx={{
                    bgcolor: "#7c3aed",
                    color: "#ffffff",
                    fontWeight: 750,
                    fontSize: "11.5px",
                    height: 24,
                  }}
                />
                <Chip
                  label="Supervisory Authority"
                  size="small"
                  sx={{
                    bgcolor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                    color: isDark ? "#34d399" : "#047857",
                    border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.3)" : "#a7f3d0"}`,
                    fontWeight: 650,
                    fontSize: "11px",
                    height: 24,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: isDark ? "#c084fc" : "#6b21a8", fontWeight: 700, fontSize: "12px" }}>
                Lead of Workspace Sprints
              </Typography>
            </Box>

            {/* Main Head Details */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              sx={{ p: { xs: 2.5, sm: 3.5 } }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: "12px", letterSpacing: "0.05em" }}>
                  ID: {headMember.id || headMember.employeeId}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 850, color: theme.palette.text.primary, mt: 0.3, mb: 1, letterSpacing: "-0.02em" }}>
                  {headMember.name}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.2, mb: 1.5 }}>
                  <Chip
                    label={headMember.position}
                    sx={{
                      bgcolor: isDark ? "rgba(109, 40, 217, 0.25)" : "#ede9fe",
                      color: isDark ? "#c4b5fd" : "#6d28d9",
                      border: `1px solid ${isDark ? "rgba(109, 40, 217, 0.4)" : "#ddd6fe"}`,
                      fontWeight: 750,
                      fontSize: "13px",
                      height: 28,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 550, fontSize: "13.5px" }}>
                    {headMember.email}
                  </Typography>
                  {headMember.gender && (
                    <Chip
                      label={headMember.gender}
                      size="small"
                      sx={{ bgcolor: isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9", color: theme.palette.text.secondary, border: `1px solid ${theme.palette.divider}`, fontSize: "11px", height: 22 }}
                    />
                  )}
                </Box>

                {/* Managed Roles of Head */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: "11.5px" }}>
                    Supervised Roles:
                  </Typography>
                  {(user?.managedRoles && user.managedRoles.length > 0
                    ? user.managedRoles
                    : ["Frontend Developer", "Backend Developer", "Full Stack Developer", "QA Engineer", "DevOps Engineer"]
                  ).map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      sx={{
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                        color: isDark ? "#a5b4fc" : "#4f46e5",
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#e0e7ff"}`,
                        fontSize: "11px",
                        height: 22,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Head Avatar */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <img
                  src={headMember.avatarSrc || "/assets/teams/male_logo_1.jpg"}
                  alt="Team Head Avatar"
                  style={{
                    height: 105,
                    width: 105,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "3.5px solid #7c3aed",
                    boxShadow: "0 8px 24px rgba(124, 58, 237, 0.22)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </Stack>

            {/* Head Footer Action Bar - NO EDIT / NO DELETE BUTTONS! */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.5,
                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fbfaff",
                borderTop: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "12px", fontStyle: "italic" }}>
                🔒 Head profile data is securely managed via Profile in the top navigation.
              </Typography>

              <Button
                size="small"
                variant="outlined"
                startIcon={<PersonOutlineIcon fontSize="small" />}
                onClick={() => setIsProfileModalOpen(true)}
                sx={{
                  color: isDark ? "#c4b5fd" : "#6d28d9",
                  borderColor: isDark ? "rgba(196, 181, 253, 0.3)" : "#c4b5fd",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  fontSize: "12px",
                  "&:hover": {
                    borderColor: isDark ? "#c4b5fd" : "#7c3aed",
                    bgcolor: isDark ? "rgba(124, 58, 237, 0.15)" : "rgba(124, 58, 237, 0.06)",
                  },
                }}
              >
                Update Head Profile
              </Button>
            </Box>
          </Card>

          {/* Visual Organizational Hierarchy Flowchart Tree Trunk */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Head card bottom anchor pin */}
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                bgcolor: "#7c3aed",
                border: `3px solid ${theme.palette.background.default}`,
                boxShadow: "0 0 0 2px #a78bfa",
                zIndex: 3,
                mt: "-7px",
              }}
            />

            {/* Vertical stem 1 */}
            <Box
              sx={{
                width: "3px",
                height: "26px",
                background: "linear-gradient(to bottom, #7c3aed, #4f46e5)",
              }}
            />

            {/* Flowchart Central Hierarchy Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 2.5,
                py: 0.8,
                borderRadius: "24px",
                background: isDark ? "linear-gradient(135deg, #1c1c24 0%, #25223a 100%)" : "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)",
                border: `2px solid ${isDark ? "rgba(99, 102, 241, 0.4)" : "#c7d2fe"}`,
                boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 4px 16px rgba(99, 102, 241, 0.12)",
                zIndex: 2,
              }}
            >
              <AccountTreeIcon sx={{ fontSize: 18, color: isDark ? "#818cf8" : "#4f46e5" }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#c7d2fe" : "#3730a3",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Direct Reporting Hierarchy • {roleGroups.length} Role {roleGroups.length === 1 ? "Pod" : "Pods"} • {sortedReportingMembers.length} Members Supervised
              </Typography>
            </Box>

            {/* Vertical stem 2 */}
            <Box
              sx={{
                width: "3px",
                height: "22px",
                bgcolor: "#4f46e5",
              }}
            />

            {/* Flowchart Arrow Mark pointing into branch distribution */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                borderRadius: "50%",
                bgcolor: "#4f46e5",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(79, 70, 229, 0.35)",
                zIndex: 3,
              }}
            >
              <ArrowDownwardIcon sx={{ fontSize: 18 }} />
            </Box>

            {/* Vertical stem 3 leading into the horizontal branch bar */}
            <Box
              sx={{
                width: "3px",
                height: "16px",
                bgcolor: "#6366f1",
              }}
            />
          </Box>
        </Box>
      )}

      {/* 2. Team Members Reporting Under Team Head (Grouped by Role Pods in Responsive Flowchart Tree) */}
      {roleGroups.length > 0 ? (
        <Box sx={{ width: "100%", pb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "1400px",
              mx: "auto",
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: { xs: 3, md: 0 },
            }}
          >
            {roleGroups.map((group, groupIndex) => {
              const isFirstGroup = groupIndex === 0;
              const isLastGroup = groupIndex === roleGroups.length - 1;
              const isSingleGroup = roleGroups.length === 1;

              return (
                <Box
                  key={group.role}
                  sx={{
                    flex: { xs: "1 1 100%", md: "1 1 0" },
                    minWidth: { xs: "100%", sm: "280px", md: "210px", lg: "240px" },
                    maxWidth: { xs: "100%", sm: "360px", md: "320px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    px: { xs: 0.5, md: 1 },
                  }}
                >
                  {/* Top Branch Connector to this Role Pod */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "48px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {/* Horizontal Main Branch Connector across Pods (Desktop) */}
                    {!isSingleGroup && (
                      <Box sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
                        {!isFirstGroup && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "50%",
                              height: "3px",
                              bgcolor: "#6366f1",
                            }}
                          />
                        )}
                        {!isLastGroup && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: "50%",
                              height: "3px",
                              bgcolor: "#6366f1",
                            }}
                          />
                        )}
                      </Box>
                    )}

                    {/* Junction Dot on Top Branch */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#4f46e5",
                        border: `1.5px solid ${theme.palette.background.default}`,
                        zIndex: 2,
                        display: { xs: "none", md: "block" },
                      }}
                    />

                    {/* Vertical stem down to Role Pod Header */}
                    <Box
                      sx={{
                        width: "3px",
                        height: "18px",
                        bgcolor: "#6366f1",
                      }}
                    />

                    {/* Arrow down to Role Pod Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: theme.palette.background.paper,
                        border: `2px solid ${isDark ? "#818cf8" : "#6366f1"}`,
                        boxShadow: isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(99, 102, 241, 0.2)",
                        zIndex: 2,
                        mt: "-2px",
                      }}
                    >
                      <ArrowDownwardIcon sx={{ fontSize: 14, color: "#4f46e5" }} />
                    </Box>

                    {/* Short connector stem into Role Pod Header */}
                    <Box
                      sx={{
                        width: "2px",
                        height: "6px",
                        bgcolor: "#6366f1",
                      }}
                    />
                  </Box>

                  {/* Role Pod Header Node */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.8,
                      borderRadius: "14px",
                      bgcolor: theme.palette.background.paper,
                      border: `2px solid ${isDark ? "rgba(99, 102, 241, 0.35)" : "#c7d2fe"}`,
                      boxShadow: isDark ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(99, 102, 241, 0.12)",
                      zIndex: 3,
                      mb: 0.5,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    {getRoleIcon(group.role)}
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        fontSize: "12.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {group.role}
                    </Typography>
                    <Chip
                      label={`${group.members.length}`}
                      size="small"
                      sx={{
                        bgcolor: isDark ? "rgba(109, 40, 217, 0.25)" : "#ede9fe",
                        color: isDark ? "#c4b5fd" : "#6d28d9",
                        fontWeight: 750,
                        fontSize: "10.5px",
                        height: 20,
                        minWidth: 22,
                        px: 0.5,
                        border: isDark ? "1px solid rgba(109, 40, 217, 0.35)" : "none",
                      }}
                    />
                  </Box>

                  {/* Vertical connector line from Role Pod Header down to its Members */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "2.5px",
                        height: "16px",
                        bgcolor: "#6366f1",
                      }}
                    />
                    <ArrowDownwardIcon sx={{ fontSize: 14, color: "#4f46e5", my: -0.5, zIndex: 2 }} />
                    <Box
                      sx={{
                        width: "2px",
                        height: "6px",
                        bgcolor: "#6366f1",
                      }}
                    />

                    {/* Members stacked vertically in this role's column */}
                    <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                      {group.members.map((member, memberIdx) => (
                        <Box key={member.id} sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          {memberIdx > 0 && (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 0.5 }}>
                              <Box sx={{ width: "2px", height: "14px", bgcolor: "#818cf8" }} />
                              <ArrowDownwardIcon sx={{ fontSize: 14, color: "#4f46e5", my: -0.4 }} />
                              <Box sx={{ width: "2px", height: "8px", bgcolor: "#818cf8" }} />
                            </Box>
                          )}
                          <TeamMemberCard
                            member={member}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            theme={theme}
                            index={memberIdx}
                            headName={headMember?.name}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "16px",
            backgroundColor: theme.palette.background.paper,
            border: `1px dashed ${theme.palette.divider}`,
            mt: 2,
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {searchTerm
              ? `No reporting members match your search criteria 😔`
              : "No reporting team members onboarded yet! 🧑‍💻"}
          </Typography>
          <Typography variant="body1" color="text.hint">
            {searchTerm
              ? "Try a different search term or check your spelling."
              : "Click 'Add New Member' to onboard developers and testers under this Head."}
          </Typography>
        </Paper>
      )}

      {/* Profile Modal for updating Head & Member profile */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        setIsOpen={setIsProfileModalOpen}
        onProfileUpdated={() => getTeam()}
      />
    </div>
  );
};

export default Team;
