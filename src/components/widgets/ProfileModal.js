import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../globalData/authSlice";
import apiService from "../services/apiServices";

const adminHeadRoles = [
  "Development Head",
  "Testing Head",
  "Engineering Lead",
  "QA Lead",
  "Project Manager",
  "Technical Director",
];

const employeeRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Tester",
  "DevOps Engineer",
];

const ProfileModal = ({ isOpen, setIsOpen, onProfileUpdated }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "Male",
    designation: "",
    managedRoles: [],
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isAdmin = currentUser?.userType === "Admin";

  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData({
        username: currentUser.username || currentUser.userName || "",
        email: currentUser.email || "",
        gender: currentUser.gender || "Male",
        designation: currentUser.designation || (isAdmin ? "Development Head" : "Full Stack Developer"),
        managedRoles: Array.isArray(currentUser.managedRoles) ? currentUser.managedRoles : [],
      });
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [currentUser, isOpen, isAdmin]);

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e, newGender) => {
    if (newGender) {
      setFormData((prev) => ({ ...prev, gender: newGender }));
    }
  };

  const handleManagedRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      managedRoles: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.username.trim()) {
      setErrorMsg("Name/Username is required");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Email address is required");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        employeeId: currentUser?.employeeId,
        id: currentUser?.employeeId || currentUser?._id,
        username: formData.username.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        designation: formData.designation,
        managedRoles: isAdmin ? formData.managedRoles : undefined,
      };

      const res = await apiService.updateProfile(payload);

      const updated = res.user || payload;
      dispatch(updateUser(updated));

      setSuccessMsg("Profile details updated successfully!");

      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }

      setTimeout(() => {
        handleClose();
      }, 900);
    } catch (err) {
      setErrorMsg(err.error || err.message || "Failed to update profile details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={Boolean(isOpen)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: 1,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: "12px",
              bgcolor: isAdmin ? "#faf5ff" : "#eff6ff",
              color: isAdmin ? "#7e22ce" : "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: isAdmin ? "#e9d5ff" : "#bfdbfe",
            }}
          >
            {isAdmin ? <ShieldOutlinedIcon sx={{ fontSize: 22 }} /> : <PersonOutlineIcon sx={{ fontSize: 22 }} />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary, fontSize: "1.15rem", lineHeight: 1.2 }}>
              {isAdmin ? "Team Head Profile" : "User Profile"}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
              Update your account information, role, and email
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "#94a3b8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", fontSize: "13px" }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: "10px", fontSize: "13px" }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" id="profile-form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Header Avatar and Basic Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.2,
              p: 2,
              borderRadius: "14px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                fontSize: "1.3rem",
                fontWeight: 800,
                bgcolor: isAdmin ? "#7c3aed" : "#2563eb",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {(formData.username || "U").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                {formData.username || "Team Member"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "12px", display: "block", mb: 0.5 }}>
                Employee ID: <strong style={{ color: "#334155" }}>{currentUser?.employeeId || "EMP-101"}</strong>
              </Typography>
              <Chip
                label={isAdmin ? "Administrator / Team Head" : "Workspace Member"}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "11px",
                  fontWeight: 700,
                  bgcolor: isAdmin ? "#ecfdf5" : "#eff6ff",
                  color: isAdmin ? "#047857" : "#1e40af",
                  border: "1px solid",
                  borderColor: isAdmin ? "#a7f3d0" : "#bfdbfe",
                }}
              />
            </Box>
          </Box>

          {/* Name Field */}
          <TextField
            fullWidth
            size="small"
            label="Full Name / Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <PersonOutlineIcon sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }} />,
              sx: { borderRadius: "10px", fontSize: "14px" },
            }}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            size="small"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <EmailOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }} />,
              sx: { borderRadius: "10px", fontSize: "14px" },
            }}
          />

          {/* Designation / Role Selection */}
          <FormControl fullWidth size="small">
            <InputLabel id="profile-role-label">Role / Designation</InputLabel>
            <Select
              labelId="profile-role-label"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              label="Role / Designation"
              sx={{ borderRadius: "10px", fontSize: "14px" }}
            >
              {(isAdmin ? adminHeadRoles : employeeRoles).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
              {/* Fallback option if user's designation is custom */}
              {!(isAdmin ? adminHeadRoles : employeeRoles).includes(formData.designation) && formData.designation && (
                <MenuItem value={formData.designation}>{formData.designation}</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Gender Toggle */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 650, color: "#475569", fontSize: "12.5px", display: "block", mb: 0.8 }}>
              Gender
            </Typography>
            <ToggleButtonGroup
              fullWidth
              value={formData.gender}
              exclusive
              onChange={handleGenderChange}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f8fafc",
                borderRadius: "10px",
                border: `1px solid ${theme.palette.divider}`,
                "& .MuiToggleButton-root": {
                  py: 0.8,
                  fontSize: "13px",
                  fontWeight: 650,
                  textTransform: "none",
                  border: "none",
                  borderRadius: "8px",
                  color: "#64748b",
                  "&.Mui-selected": {
                    bgcolor: isDark ? "rgba(10, 132, 255, 0.2)" : "#ffffff",
                    color: isDark ? "#409cff" : "#2563eb",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              <ToggleButton value="Male">Male</ToggleButton>
              <ToggleButton value="Female">Female</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Admin Managed Roles Multi-select */}
          {isAdmin && (
            <FormControl fullWidth size="small">
              <InputLabel id="profile-managed-roles-label">Managed Team Roles</InputLabel>
              <Select
                labelId="profile-managed-roles-label"
                multiple
                value={formData.managedRoles}
                onChange={handleManagedRolesChange}
                input={<OutlinedInput label="Managed Team Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip key={val} label={val} size="small" sx={{ fontSize: "11px", height: 22 }} />
                    ))}
                  </Box>
                )}
                sx={{ borderRadius: "10px", fontSize: "14px" }}
              >
                {employeeRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#64748b",
            fontSize: "13px",
            fontWeight: 650,
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="profile-form"
          variant="contained"
          disabled={loading}
          startIcon={!loading && <SaveIcon sx={{ fontSize: 17 }} />}
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            py: 0.8,
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca 0%, #6b21a8 100%)",
            },
          }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
