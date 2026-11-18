import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Fade,
} from "@mui/material";
import {
  Close as CloseIcon,
  LockReset as LockResetIcon,
  Visibility,
  VisibilityOff,
  CheckCircle,
  PersonOutline,
  MailOutline,
  Key as KeyIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import apiService from "../services/apiServices";

const ChangePasswordModal = ({ open, onClose, user, onSuccessRedirect }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset state on open/close
  useEffect(() => {
    if (open) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPass(false);
      setShowNewPass(false);
      setShowConfirmPass(false);
      setIsVerifying(false);
      setIsVerified(false);
      setIsUpdating(false);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [open]);

  // Handle Step 1: Verify Old Password
  const handleVerifyOldPassword = async (e) => {
    if (e) e.preventDefault();
    if (!oldPassword.trim()) {
      setErrorMsg("Please enter your current password to verify.");
      return;
    }

    try {
      setErrorMsg("");
      setIsVerifying(true);

      const res = await apiService.verifyPassword({
        email: user?.email,
        username: user?.username || user?.userName,
        oldPassword: oldPassword.trim(),
      });

      if (res && res.success) {
        setIsVerified(true);
        setErrorMsg("");
      } else {
        setErrorMsg(res?.message || "Incorrect current password. Please try again.");
      }
    } catch (err) {
      setErrorMsg(
        err?.error ||
          err?.message ||
          "Incorrect current password. Verification failed."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Step 2: Submit New Password
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMsg("New password cannot be the same as your old password.");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await apiService.changePassword({
        email: user?.email,
        username: user?.username || user?.userName,
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      if (res && res.success) {
        setSuccessMsg(
          "Password updated successfully in database! Redirecting to login..."
        );
        setTimeout(() => {
          if (onSuccessRedirect) onSuccessRedirect();
        }, 1400);
      } else {
        setErrorMsg(res?.error || "Failed to update password. Please try again.");
      }
    } catch (err) {
      setErrorMsg(
        err?.error ||
          err?.message ||
          "Failed to update password in database. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isUpdating || isVerifying ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      {/* Dialog Header with Multi-color Gradient Accent */}
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #4f46e5 0%, #9333ea 50%, #0d9488 100%)",
        }}
      />

      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              border: "1px solid #e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f46e5",
            }}
          >
            <LockResetIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: theme.palette.text.primary,
                fontSize: "1.15rem",
                letterSpacing: "-0.01em",
              }}
            >
              Change Account Password
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
              Verify your current credentials and configure a new secure password.
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={isVerifying || isUpdating}
          size="small"
          sx={{
            color: "#94a3b8",
            "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
        {/* Alerts */}
        {errorMsg && (
          <Alert
            severity="error"
            onClose={() => setErrorMsg("")}
            sx={{
              mb: 2.5,
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert
            severity="success"
            sx={{
              mb: 2.5,
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {successMsg}
          </Alert>
        )}

        {/* Read-Only Bound User Details */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#64748b",
                fontSize: "11px",
              }}
            >
              Account Binding (Read-Only)
            </Typography>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: "14px !important" }} />}
              label="Secured Identity"
              size="small"
              sx={{
                height: 20,
                fontSize: "10.5px",
                fontWeight: 700,
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                border: "1px solid #c7d2fe",
              }}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, mb: 0.5, display: "block" }}>
                Username
              </Typography>
              <TextField
                value={user?.username || user?.userName || ""}
                disabled
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ fontSize: 18, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 0,
                    bgcolor: "#f1f5f9",
                    fontSize: "13px",
                    color: "#334155",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, mb: 0.5, display: "block" }}>
                Work Email
              </Typography>
              <TextField
                value={user?.email || ""}
                disabled
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline sx={{ fontSize: 18, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 0,
                    bgcolor: "#f1f5f9",
                    fontSize: "13px",
                    color: "#334155",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Step 1: Current / Old Password Verification */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.8,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
              1. Current / Old Password
            </Typography>
            {isVerified && (
              <Chip
                icon={<CheckCircle sx={{ fontSize: "14px !important", color: "#059669 !important" }} />}
                label="Old Password Verified"
                size="small"
                sx={{
                  height: 22,
                  fontSize: "11px",
                  fontWeight: 700,
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
            <TextField
              type={showOldPass ? "text" : "password"}
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (isVerified) setIsVerified(false);
              }}
              disabled={isVerified || isVerifying || isUpdating}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPass(!showOldPass)}
                      size="small"
                      edge="end"
                      disabled={isVerified}
                    >
                      {showOldPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 0, fontSize: "13.5px" },
              }}
            />

            {!isVerified && (
              <Button
                variant="contained"
                onClick={handleVerifyOldPassword}
                disabled={isVerifying || !oldPassword.trim() || isUpdating}
                sx={{
                  bgcolor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: 650,
                  fontSize: "13px",
                  borderRadius: 0,
                  px: 3,
                  py: 1,
                  minWidth: { xs: "100%", sm: "160px" },
                  whiteSpace: "nowrap",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#4338ca",
                    boxShadow: "0 2px 6px rgba(79, 70, 229, 0.25)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#e2e8f0 !important",
                    color: "#94a3b8 !important",
                  },
                }}
              >
                {isVerifying ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                    <span>Verifying...</span>
                  </Box>
                ) : (
                  "Verify Old Password"
                )}
              </Button>
            )}
          </Box>
        </Box>

        {/* Step 2: Set New Password (Revealed only after successful verification) */}
        {isVerified && (
          <Fade in={isVerified} timeout={400}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                2. Set New Password
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#374151", fontWeight: 600, mb: 0.5, display: "block" }}>
                    New Password
                  </Typography>
                  <TextField
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter new password (min. 4 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockResetIcon sx={{ fontSize: 18, color: "#4f46e5" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPass(!showNewPass)}
                            size="small"
                            edge="end"
                          >
                            {showNewPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "8px", bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff", fontSize: "13.5px" },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#374151", fontWeight: 600, mb: 0.5, display: "block" }}>
                    Confirm New Password
                  </Typography>
                  <TextField
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isUpdating}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckCircle sx={{ fontSize: 18, color: "#0d9488" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            size="small"
                            edge="end"
                          >
                            {showConfirmPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "8px", bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff", fontSize: "13.5px" },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          px: 3,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isVerifying || isUpdating}
          variant="outlined"
          sx={{
            borderRadius: 0,
            textTransform: "none",
            fontWeight: 650,
            color: "#64748b",
            borderColor: "#cbd5e1",
            "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
          }}
        >
          Cancel
        </Button>

        {isVerified && (
          <Button
            onClick={handleChangePassword}
            disabled={isUpdating || !newPassword || !confirmPassword}
            variant="contained"
            sx={{
              bgcolor: "#4f46e5",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 650,
              fontSize: "13.5px",
              borderRadius: 0,
              px: 3,
              py: 1,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#4338ca",
                boxShadow: "0 2px 6px rgba(79, 70, 229, 0.25)",
              },
              "&.Mui-disabled": {
                bgcolor: "#e2e8f0 !important",
                color: "#94a3b8 !important",
              },
            }}
          >
            {isUpdating ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                <span>Updating in Database...</span>
              </Box>
            ) : (
              "Update Password & Re-login"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
