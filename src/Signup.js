import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import KeyIcon from "@mui/icons-material/Key";
import React, { useState } from "react";
import apiService from "./components/services/apiServices";

const employeeRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Tester",
  "DevOps Engineer",
];

const adminHeadRoles = [
  "Development Head",
  "Testing Head",
  "Engineering Lead",
  "QA Lead",
  "Project Manager",
  "Technical Director",
];

const Signup = ({ setIsLogIn }) => {
  const [userType, setUserType] = useState("Employee");
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [adminAuthForm, setAdminAuthForm] = useState({ userEmail: "", password: "" });
  const [adminAuthError, setAdminAuthError] = useState("");
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [showAdminAuthPassword, setShowAdminAuthPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "Full Stack Developer",
    adminDesignation: "Development Head",
    managedRoles: ["Frontend Developer", "Backend Developer"],
    gender: "Male",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleManagedRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setForm((prev) => ({
      ...prev,
      managedRoles: typeof value === "string" ? value.split(",") : value,
    }));
    setErrors((prev) => ({ ...prev, managedRoles: "" }));
  };

  const handleRoleSelect = (role) => {
    setUserType(role);
    setAdminAuthError("");
  };

  // Verify Admin credentials in-place inside the card (No modal!)
  const handleVerifyAdminSignupSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!adminAuthForm.userEmail.trim()) {
      setAdminAuthError("Please enter Administrator email or username");
      return;
    }
    if (!adminAuthForm.password) {
      setAdminAuthError("Please enter Administrator password");
      return;
    }

    setAdminAuthLoading(true);
    setAdminAuthError("");
    try {
      const res = await apiService.verifyAdmin({
        userEmail: adminAuthForm.userEmail.trim(),
        password: adminAuthForm.password,
      });

      setIsAdminVerified(true);
      setUserType("Admin");

      setSnackbar({
        open: true,
        message: res.message || "Admin authorization verified! Admin account creation unlocked.",
        severity: "success",
      });
    } catch (err) {
      setAdminAuthError(err.error || err.message || "Admin verification failed. Access Denied.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const newErrors = {};

    if (!form.userName.trim()) newErrors.userName = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (userType === "Admin") {
      if (!form.adminDesignation) {
        newErrors.adminDesignation = "Admin designation is required";
      }
      if (!form.managedRoles || form.managedRoles.length === 0) {
        newErrors.managedRoles = "Please select at least one role managed by this Admin";
      }
    } else {
      if (!form.designation) {
        newErrors.designation = "Designation is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        username: form.userName.trim(),
        email: form.email.trim(),
        pass: form.password,
        userType: userType,
        gender: form.gender,
        designation:
          userType === "Admin" ? form.adminDesignation : form.designation,
        managedRoles: userType === "Admin" ? form.managedRoles : [],
      };

      const res = await apiService.register(payload);

      setSnackbar({
        open: true,
        message:
          res.message ||
          `${userType} account created successfully! You can now log in.`,
        severity: "success",
      });

      setTimeout(() => {
        setIsLogIn(true);
      }, 1200);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.error || err.message || "Registration failed. Try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid
        item
        xs={12}
        md={6}
        lg={5.5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6, lg: 8 },
          backgroundColor: "#f8fafc",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            bgcolor: "#ffffff",
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 45px -15px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "left", mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <img
                src="/appLogo.png"
                alt="Dasher Logo"
                style={{ height: "32px", objectFit: "contain" }}
              />
              <Chip
                label={userType === "Admin" ? (isAdminVerified ? "Admin Verified" : "Admin Auth Required") : "Workspace Account"}
                size="small"
                sx={{
                  fontSize: "11px",
                  fontWeight: 650,
                  bgcolor: userType === "Admin" ? (isAdminVerified ? "#ecfdf5" : "#faf5ff") : "#f1f5f9",
                  color: userType === "Admin" ? (isAdminVerified ? "#047857" : "#7e22ce") : "#475569",
                  border: "1px solid",
                  borderColor: userType === "Admin" ? (isAdminVerified ? "#a7f3d0" : "#e9d5ff") : "#e2e8f0",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.025em",
                fontSize: "1.55rem",
              }}
            >
              {userType === "Admin" && !isAdminVerified
                ? "Admin Authorization"
                : "Create an account"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mt: 0.5, fontSize: "0.875rem" }}
            >
              {userType === "Admin" && !isAdminVerified
                ? "Verify existing Administrator credentials to unlock Admin registration."
                : "Choose your role to configure workspace hierarchy."}
            </Typography>
          </Box>

          {/* Segmented Control */}
          <Box
            sx={{
              display: "flex",
              p: 0.5,
              bgcolor: "#f1f5f9",
              borderRadius: "10px",
              mb: 2.5,
            }}
          >
            <Button
              fullWidth
              onClick={() => handleRoleSelect("Employee")}
              startIcon={<PersonOutlineIcon sx={{ fontSize: 16 }} />}
              sx={{
                py: 0.75,
                fontSize: "12.5px",
                fontWeight: 650,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: userType === "Employee" ? "#ffffff" : "transparent",
                color: userType === "Employee" ? "#0f172a" : "#64748b",
                boxShadow:
                  userType === "Employee"
                    ? "0 2px 5px rgba(0,0,0,0.06)"
                    : "none",
                "&:hover": {
                  bgcolor:
                    userType === "Employee"
                      ? "#ffffff"
                      : "rgba(0,0,0,0.03)",
                },
              }}
            >
              Employee
            </Button>
            <Button
              fullWidth
              onClick={() => handleRoleSelect("Admin")}
              startIcon={
                isAdminVerified ? (
                  <VerifiedUserIcon sx={{ fontSize: 16, color: "#10b981" }} />
                ) : (
                  <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                )
              }
              sx={{
                py: 0.75,
                fontSize: "12.5px",
                fontWeight: 650,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: userType === "Admin" ? "#ffffff" : "transparent",
                color: userType === "Admin" ? "#4f46e5" : "#64748b",
                boxShadow:
                  userType === "Admin"
                    ? "0 2px 5px rgba(79, 70, 229, 0.12)"
                    : "none",
                "&:hover": {
                  bgcolor:
                    userType === "Admin"
                      ? "#ffffff"
                      : "rgba(0,0,0,0.03)",
                },
              }}
            >
              Admin / Head Role
            </Button>
          </Box>

          {/* In-place Admin Verification Form or Registration Form */}
          {userType === "Admin" && !isAdminVerified ? (
            <Box
              component="form"
              onSubmit={handleVerifyAdminSignupSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {adminAuthError && (
                <Alert severity="error" sx={{ borderRadius: "8px", fontSize: "13px" }}>
                  {adminAuthError}
                </Alert>
              )}

              <TextField
                label="Admin Email or Username"
                name="userEmail"
                fullWidth
                size="small"
                value={adminAuthForm.userEmail}
                onChange={(e) =>
                  setAdminAuthForm((prev) => ({ ...prev, userEmail: e.target.value }))
                }
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: "10px", fontSize: "14px" },
                }}
              />

              <TextField
                label="Admin Password"
                name="password"
                type={showAdminAuthPassword ? "text" : "password"}
                fullWidth
                size="small"
                value={adminAuthForm.password}
                onChange={(e) =>
                  setAdminAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowAdminAuthPassword(!showAdminAuthPassword)}
                        edge="end"
                        size="small"
                      >
                        {showAdminAuthPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontSize: "14px" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={adminAuthLoading}
                sx={{
                  height: 44,
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #7e22ce 0%, #4338ca 100%)",
                  color: "#ffffff",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 4px 14px rgba(126, 34, 206, 0.35)",
                }}
              >
                {adminAuthLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Verify & Unlock Admin Signup"
                )}
              </Button>

              <Typography
                align="center"
                variant="body2"
                sx={{ color: "#64748b", mt: 0.5, fontSize: "13px" }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => setIsLogIn(true)}
                  sx={{
                    color: "#2563eb",
                    cursor: "pointer",
                    fontWeight: 650,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in
                </Box>
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label={userType === "Admin" ? "Admin Name" : "Full Name"}
                name="userName"
                fullWidth
                size="small"
                value={form.userName}
                onChange={handleInputChange}
                error={!!errors.userName}
                helperText={errors.userName}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: "10px",
                    fontSize: "14px",
                  },
                }}
              />

              <TextField
                label={userType === "Admin" ? "Admin Official Email" : "Email Address"}
                name="email"
                type="email"
                fullWidth
                size="small"
                value={form.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: "10px",
                    fontSize: "14px",
                  },
                }}
              />

              {userType === "Admin" ? (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel id="admin-designation-label">Admin Head Role</InputLabel>
                    <Select
                      labelId="admin-designation-label"
                      name="adminDesignation"
                      value={form.adminDesignation}
                      onChange={handleInputChange}
                      label="Admin Head Role"
                      sx={{ borderRadius: "10px", fontSize: "14px" }}
                    >
                      {adminHeadRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" error={!!errors.managedRoles}>
                    <InputLabel id="managed-roles-label">Managed Team Roles</InputLabel>
                    <Select
                      labelId="managed-roles-label"
                      multiple
                      value={form.managedRoles}
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
                </>
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel id="employee-designation-label">Designation</InputLabel>
                  <Select
                    labelId="employee-designation-label"
                    name="designation"
                    value={form.designation}
                    onChange={handleInputChange}
                    label="Designation"
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

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                size="small"
                value={form.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontSize: "14px" },
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                size="small"
                value={form.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "10px", fontSize: "14px" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  height: 44,
                  mt: 0.5,
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: userType === "Admin"
                    ? "linear-gradient(135deg, #7e22ce 0%, #4338ca 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                  color: "#ffffff",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                  "&:hover": {
                    background: userType === "Admin"
                      ? "linear-gradient(135deg, #6b21a8 0%, #3730a3 100%)"
                      : "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
                  },
                }}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : `Create ${userType} Account`}
              </Button>

              <Typography
                align="center"
                variant="body2"
                sx={{ color: "#64748b", mt: 0.5, fontSize: "13px" }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => setIsLogIn(true)}
                  sx={{
                    color: "#2563eb",
                    cursor: "pointer",
                    fontWeight: 650,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in
                </Box>
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default Signup;