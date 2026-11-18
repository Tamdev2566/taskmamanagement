import {
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
  FileUpload as FileUploadIcon,
  Timer as TimerIcon,
  Title as TitleIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useTheme } from "@mui/material/styles";
import { selectUser } from "../globalData/authSlice";
import apiService from "./services/apiServices";

export const CreateTask = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const user = useSelector(selectUser);
  const [errors, setErrors] = useState({});
  const [priority, setPriority] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    workType: null,
    priority: null,
    duration: "",
  });

  const workTypeOptions = [
    { label: "Epic", id: 1 },
    { label: "Spike/Research", id: 2 },
    { label: "Feature/Enhancement", id: 3 },
    { label: "Bug", id: 4 },
    { label: "Task", id: 5 },
  ];

  const priorityOptions = [
    { label: "Low", id: 1 },
    { label: "Medium", id: 2 },
    { label: "High", id: 3 },
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!newTask.title.trim()) newErrors.title = "Title is required";
    if (!newTask.description.trim())
      newErrors.description = "Description is required";
    if (!newTask.workType) newErrors.workType = "Work Type is required";
    if (!newTask.priority) newErrors.priority = "Priority is required";
    if (!newTask.duration) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setAttachedFile(event.target.files[0]);
    } else {
      setAttachedFile(null);
    }
  };

  const handleAddTask = async () => {
    if (!validateFields()) return;

    setSubmitting(true);
    try {
      const taskPayload = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        workType: newTask.workType ? newTask.workType.label : "Task",
        priority: newTask.priority ? newTask.priority.label : "Medium",
        duration: Number(newTask.duration) || 8,
        createdBy: user?.username || user?.userName || user?.name || "Admin",
        createdById: user?.employeeId ? String(user.employeeId) : "",
        createdByEmail: user?.email || "",
        userEmpId: user?.employeeId,
        userEmail: user?.email,
        userType: user?.userType,
        createdOn: new Date(),
        status: "Unassigned",
        attachment: attachedFile ? attachedFile.name : null,
        requirementData: messageContent,
      };

      const res = await apiService.postTask(taskPayload);
      setSnackbar({
        open: true,
        message: res.message || "Task created successfully in database!",
        severity: "success",
      });

      setNewTask({
        title: "",
        description: "",
        workType: null,
        priority: null,
        duration: "",
      });
      setPriority(null);
      setAttachedFile(null);
      setMessageContent("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setErrors({});

      setTimeout(() => navigate("/task"), 800);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to create task",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonTasks = XLSX.utils.sheet_to_json(worksheet);

          const formattedTasks = jsonTasks
            .map((item) => {
              const title = item.Title || item.title;
              const desc = item.Description || item.description;
              const prio = item.Priority || item.priority;

              if (title && desc) {
                return {
                  title,
                  description: desc,
                  assignedMember: item.AssignedMember || item.assignedMember || "",
                  priority: ["Low", "Medium", "High"].includes(prio) ? prio : "Medium",
                  duration: Number(item.Duration || item.duration || 8),
                  workType: item["Work Type"] || item.workType || "Task",
                  createdBy: user?.username || user?.userName || "Excel Upload",
                };
              }
              return null;
            })
            .filter((t) => t !== null);

          if (formattedTasks.length > 0) {
            const res = await apiService.bulkSaveTasks(formattedTasks, user?.employeeId);
            setSnackbar({
              open: true,
              message: res.message || `${formattedTasks.length} tasks imported to database!`,
              severity: "success",
            });
            setTimeout(() => navigate("/task"), 1000);
          } else {
            setSnackbar({
              open: true,
              message:
                "No valid tasks found. Make sure 'Title' and 'Description' columns exist.",
              severity: "error",
            });
          }
        } catch (err) {
          setSnackbar({
            open: true,
            message: "Failed to parse or upload Excel file",
            severity: "error",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = null;
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          insertImage(event.target.result);
        };
        reader.readAsDataURL(file);
      } else if (item.type === "text/plain") {
        item.getAsString((text) => {
          document.execCommand("insertText", false, text);
          updateContent();
        });
      }
    }
  };

  const insertImage = (src) => {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.margin = "4px 0";
    editorRef.current.appendChild(img);
    updateContent();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => insertImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setMessageContent(html);
    }
  };

  const canCreate = user?.userType === "Admin" || user?.canCreateTask === true;

  if (user && !canCreate) {
    return (
      <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3, maxWidth: 600, mx: "auto", mt: 6 }}>
        <Typography variant="h5" color="error" fontWeight={700} gutterBottom>
          Task Creation Restricted
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Only Admin users and authorized employees have permission to create tasks. Please contact your manager or Admin.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/task")}>
          Go to Tasks
        </Button>
      </Paper>
    );
  }

  return (
    <>
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

      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: "16px",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 1px 3px 0 rgba(0, 0, 0, 0.04)",
          bgcolor: theme.palette.background.paper,
          mt: 2,
        }}
      >
        <Typography variant="h5" fontWeight={750} mb={3} color={theme.palette.text.primary} sx={{ letterSpacing: "-0.01em" }}>
          Create New Sprint Task
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Requirement Details & Notes
            </Typography>

            <div
              ref={editorRef}
              contentEditable
              onInput={updateContent}
              onPaste={handlePaste}
              style={{
                minHeight: "330px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                outline: "none",
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#fafafa", borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "#ccc", color: isDark ? "#f5f5f7" : "inherit",
              }}
              placeholder="Type requirements, paste images, or write detailed specifications..."
            ></div>

            <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => fileInputRef.current.click()}
              >
                Insert Screenshot / Image
              </Button>

              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Task Title"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  accept="*"
                  style={{ display: "none" }}
                  id="task-attachment-upload"
                  type="file"
                  onChange={handleAttachmentChange}
                />
                <label htmlFor="task-attachment-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AttachFileIcon />}
                    component="span"
                    fullWidth
                  >
                    {attachedFile
                      ? attachedFile.name
                      : "Attach File / Document (Optional)"}
                  </Button>
                </label>
                {attachedFile && (
                  <Typography
                    variant="caption"
                    display="block"
                    mt={0.5}
                    sx={{ color: "text.secondary", ml: 1 }}
                  >
                    Selected: <strong>{attachedFile.name}</strong>
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={workTypeOptions}
                  value={newTask.workType}
                  onChange={(e, v) => handleAutocompleteChange("workType", v)}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Work Type"
                      size="small"
                      error={!!errors.workType}
                      helperText={errors.workType}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={600} mb={0.5}>
                  Priority
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={priority}
                  onChange={(e, v) => {
                    setPriority(v);
                    handleAutocompleteChange(
                      "priority",
                      priorityOptions.find(
                        (p) => p.label.toLowerCase() === (v || "")
                      )
                    );
                  }}
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      borderRadius: "10px !important",
                      textTransform: "none",
                      border: "1px solid #ddd",
                    },
                    "& .Mui-selected": {
                      color: "white",
                      backgroundColor: () => {
                        switch (priority) {
                          case "low":
                            return "#4caf50";
                          case "medium":
                            return "#ff9800";
                          case "high":
                            return "#f44336";
                          default:
                            return "#1976d2";
                        }
                      },
                      "&:hover": { opacity: 0.9 },
                    },
                  }}
                >
                  <ToggleButton value="low">Low</ToggleButton>
                  <ToggleButton value="medium">Medium</ToggleButton>
                  <ToggleButton value="high">High</ToggleButton>
                </ToggleButtonGroup>
                {errors.priority && (
                  <Typography variant="caption" color="error">
                    {errors.priority}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Task Description"
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Estimated Man Hours"
                  name="duration"
                  type="number"
                  value={newTask.duration}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimerIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={1.5}>
          <Button
            variant="outlined"
            onClick={() => navigate("/task")}
            sx={{
              borderRadius: "8px",
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 650,
              textTransform: "none",
              px: 2.5,
              py: 0.8,
              "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
            }}
          >
            Cancel
          </Button>

          <input
            accept=".xlsx, .xls, .csv"
            style={{ display: "none" }}
            id="excel-file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="excel-file-upload">
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon sx={{ fontSize: 18 }} />}
              component="span"
              sx={{
                borderRadius: "8px",
                borderColor: "#c7d2fe",
                color: "#4f46e5",
                bgcolor: "#eef2ff",
                fontWeight: 650,
                textTransform: "none",
                px: 2.5,
                py: 0.8,
                "&:hover": { borderColor: "#818cf8", bgcolor: "#e0e7ff" },
              }}
            >
              Upload Excel Sheet
            </Button>
          </label>

          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            disabled={submitting}
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
              color: "#ffffff",
              borderRadius: "8px",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              py: 0.85,
              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.45)",
              },
            }}
            onClick={handleAddTask}
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit Task"
            )}
          </Button>
        </Box>
      </Paper>
    </>
  );
};
