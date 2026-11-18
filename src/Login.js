import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Chip,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setEmployee, setInitialLoading } from "./globalData/authSlice";
import Signup from "./Signup";
import apiService from "./components/services/apiServices";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ userName: "", password: "" });
  const [errors, setErrors] = useState({ userName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value
        ? ""
        : `${name === "userName" ? "User Name or Email" : "Password"} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    let valid = true;
    const newErrors = { userName: "", password: "" };

    if (!form.userName.trim()) {
      newErrors.userName = "Please enter your username or email";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password = "Please enter your password";
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;

    setIsLoading(true);
    try {
      const res = await apiService.login({
        userName: form.userName.trim(),
        password: form.password,
      });

      if (res.token) {
        localStorage.setItem("userToken", res.token);
      }

      const userData = res.data || { username: form.userName };

      dispatch(login(userData));
      dispatch(setEmployee(userData));

      setSnackbar({
        open: true,
        message: res.message || "Signed in successfully",
        severity: "success",
      });

      dispatch(setInitialLoading(true));
      setTimeout(() => {
        navigate("/dashboard");
      }, 400);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.error || err.message || "Invalid username or password",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => setIsLogIn(false);

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
          sx={{ width: "100%", borderRadius: "10px", fontWeight: 500, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "stretch",
          backgroundColor: "#f8fafc",
        }}
      >
        <Grid
          container
          sx={{
            width: "100%",
            maxWidth: "100vw",
            minHeight: "100vh",
          }}
        >
          {/* Left Showcase Side - Elegant Presentation with login.jpg Image */}
          <Grid
            item
            xs={12}
            md={6}
            lg={6.5}
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              p: { md: 4, lg: 6 },
              background:
                "linear-gradient(150deg, #f8fafc 0%, #eff6ff 45%, #f1f5f9 100%)",
              borderRight: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top Brand Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    p: 1,
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <img
                    src="/appLogo.png"
                    alt="Dasher Logo"
                    style={{
                      height: "32px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 850,
                      color: "#0f172a",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      fontSize: "1.25rem",
                    }}
                  >
                    DASHER
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontSize: "11px",
                      fontWeight: 650,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Agile Sprint & Lifecycle Platform
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="Enterprise Edition"
                size="small"
                icon={<ShieldOutlinedIcon sx={{ fontSize: "14px !important", color: "#2563eb !important" }} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1e40af",
                  border: "1px solid #cbd5e1",
                  fontSize: "11px",
                  fontWeight: 650,
                  height: 28,
                  px: 0.5,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                }}
              />
            </Box>

            {/* Central Showcase: Prominent login.jpg Image */}
            <Box
              sx={{
                my: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                py: 2,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  borderRadius: "20px",
                  overflow: "hidden",
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "#ffffff",
                  boxShadow: "0 20px 45px -15px rgba(37, 99, 235, 0.14)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 25px 50px -15px rgba(37, 99, 235, 0.2)",
                  },
                }}
              >
                <Box
                  component="img"
                  src="/login.jpg"
                  alt="Agile Sprint Lifecycle"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 380,
                    objectFit: "contain",
                    borderRadius: "14px",
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 850,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                  fontSize: { md: "1.75rem", lg: "2.05rem" },
                  lineHeight: 1.25,
                  mb: 1.2,
                }}
              >
                Agile Sprint & Lifecycle Management
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: "0.925rem",
                  lineHeight: 1.6,
                  maxWidth: 520,
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                Seamlessly coordinate tasks between Developers, QA Testers, and Leads with real-time lifecycle tracking, assigned hours, and automated corporate email notifications.
              </Typography>

              {/* Feature Badges */}
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.2 }}>
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: "15px !important", color: "#059669 !important" }} />}
                  label="Unified Lifecycle Tracking"
                  sx={{
                    bgcolor: "#ecfdf5",
                    color: "#065f46",
                    border: "1px solid #a7f3d0",
                    fontWeight: 650,
                    fontSize: "12px",
                  }}
                />
                <Chip
                  icon={<FlashOnIcon sx={{ fontSize: "15px !important", color: "#2563eb !important" }} />}
                  label="Real-Time Dev & QA Status"
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    border: "1px solid #bfdbfe",
                    fontWeight: 650,
                    fontSize: "12px",
                  }}
                />
                <Chip
                  icon={<ShieldOutlinedIcon sx={{ fontSize: "15px !important", color: "#7c3aed !important" }} />}
                  label="Role-Based Governance"
                  sx={{
                    bgcolor: "#faf5ff",
                    color: "#6b21a8",
                    border: "1px solid #e9d5ff",
                    fontWeight: 650,
                    fontSize: "12px",
                  }}
                />
              </Box>
            </Box>

            {/* Bottom Trust & Compliance Bar */}
            <Box
              sx={{
                pt: 2.5,
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                zIndex: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "12px", fontWeight: 550 }}>
                © 2026 Dasher Enterprise Suite. All rights reserved.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="caption" sx={{ color: "#475569", fontSize: "12px", fontWeight: 650 }}>
                  SOC-2 Type II
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1" }}>•</Typography>
                <Typography variant="caption" sx={{ color: "#475569", fontSize: "12px", fontWeight: 650 }}>
                  256-Bit TLS
                </Typography>
                <Typography variant="caption" sx={{ color: "#cbd5e1" }}>•</Typography>
                <Typography variant="caption" sx={{ color: "#475569", fontSize: "12px", fontWeight: 650 }}>
                  RBAC Active
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Form Side - Clean Single Sign In */}
          {isLogIn ? (
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
                {/* Form Header */}
                <Box sx={{ textAlign: "left", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <img
                      src="/appLogo.png"
                      alt="Dasher Logo"
                      style={{ height: "32px", objectFit: "contain" }}
                    />
                    <Chip
                      icon={<ShieldOutlinedIcon sx={{ fontSize: "13px !important" }} />}
                      label="SOC-2 Secure"
                      size="small"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 650,
                        bgcolor: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
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
                      fontSize: "1.6rem",
                    }}
                  >
                    Welcome back
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mt: 0.5, fontSize: "0.875rem" }}
                  >
                    Enter your workspace credentials to access your sprints.
                  </Typography>
                </Box>

                {/* Single Unified Sign In Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 650,
                        color: "#334155",
                        fontSize: "13px",
                        display: "block",
                        mb: 0.6,
                      }}
                    >
                      Username or Email
                    </Typography>
                    <TextField
                      name="userName"
                      fullWidth
                      size="small"
                      placeholder="e.g. saravanan or saravananc@gmail.com"
                      value={form.userName}
                      onChange={handleInputChange}
                      error={!!errors.userName}
                      helperText={errors.userName}
                      variant="outlined"
                      autoComplete="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "10px",
                          fontSize: "14px",
                          bgcolor: "#ffffff",
                          "& fieldset": { borderColor: "#cbd5e1" },
                          "&:hover fieldset": { borderColor: "#94a3b8" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563eb",
                            borderWidth: "1.5px",
                            boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 650,
                          color: "#334155",
                          fontSize: "13px",
                        }}
                      >
                        Password
                      </Typography>
                    </Box>
                    <TextField
                      name="password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      size="small"
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={handleInputChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      variant="outlined"
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{ color: "#94a3b8" }}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "10px",
                          fontSize: "14px",
                          bgcolor: "#ffffff",
                          "& fieldset": { borderColor: "#cbd5e1" },
                          "&:hover fieldset": { borderColor: "#94a3b8" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563eb",
                            borderWidth: "1.5px",
                            boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    endIcon={!isLoading && <ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      height: 46,
                      mt: 1,
                      fontWeight: 700,
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: "14px",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4338ca 0%, #6b21a8 100%)",
                        boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Sign In to Workspace"
                    )}
                  </Button>

                  <Typography
                    align="center"
                    variant="body2"
                    sx={{ color: "#64748b", mt: 1, fontSize: "13px" }}
                  >
                    Don't have an account?{" "}
                    <Box
                      component="span"
                      onClick={handleSignup}
                      sx={{
                        color: "#2563eb",
                        cursor: "pointer",
                        fontWeight: 650,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create account
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ) : (
            <Signup setIsLogIn={setIsLogIn} />
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Login;
