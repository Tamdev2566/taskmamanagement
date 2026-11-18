import React, { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import apiService from "./services/apiServices";

const localizer = momentLocalizer(moment);

function DashboardCalendar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getEvents();
      if (Array.isArray(res)) {
        const formatted = res.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(formatted);
      }
    } catch (err) {
      // Gracefully handle calendar events load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = isDark ? "#0a84ff" : "#0071e3";
    if (event.title.includes("High")) backgroundColor = "#ff453a";
    else if (event.title.includes("Medium")) backgroundColor = "#ff9f0a";
    else if (event.title.includes("Low")) backgroundColor = "#30d158";
    else if (event.title.includes("Meeting") || event.title.includes("Standup"))
      backgroundColor = isDark ? "#bf5af2" : "#af52de";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.95,
        color: "#ffffff",
        border: "0px",
        display: "block",
        fontWeight: "600",
        fontSize: "11.5px",
        padding: "2px 5px",
      },
    };
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? "0 4px 20px rgba(0, 0, 0, 0.4)"
          : "0 2px 10px rgba(0, 0, 0, 0.03)",
        /* Calendar Theme overrides for Dark / Light mode */
        "& .rbc-calendar": {
          color: theme.palette.text.primary,
          fontFamily: "inherit",
        },
        "& .rbc-header": {
          color: theme.palette.text.secondary,
          fontWeight: 650,
          fontSize: "12px",
          padding: "8px 0",
          borderBottom: `1px solid ${theme.palette.divider} !important`,
        },
        "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view": {
          borderColor: `${theme.palette.divider} !important`,
          borderRadius: "12px",
          overflow: "hidden",
        },
        "& .rbc-day-bg + .rbc-day-bg, & .rbc-month-row + .rbc-month-row": {
          borderColor: `${theme.palette.divider} !important`,
        },
        "& .rbc-off-range-bg": {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.25)"
            : "rgba(0, 0, 0, 0.02)",
        },
        "& .rbc-today": {
          backgroundColor: isDark
            ? "rgba(10, 132, 255, 0.12)"
            : "rgba(0, 113, 227, 0.06)",
        },
        "& .rbc-toolbar button": {
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          borderRadius: "8px",
          padding: "5px 12px",
          fontSize: "12.5px",
          fontWeight: 600,
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
          },
          "&.rbc-active": {
            backgroundColor: isDark ? "#0a84ff" : "#0071e3",
            borderColor: isDark ? "#0a84ff" : "#0071e3",
            color: "#ffffff",
          },
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={750}
            color={theme.palette.text.primary}
            sx={{ letterSpacing: "-0.02em" }}
          >
            Sprint & Task Calendar
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            Visual timeline of development sprints, QA milestones, and planned releases.
          </Typography>
        </Box>
        <Tooltip title="Refresh Events">
          <span>
            <IconButton
              onClick={fetchEvents}
              disabled={loading}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "10px",
                width: 36,
                height: 36,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.02)",
              }}
            >
              <RefreshIcon sx={{ fontSize: 18, color: theme.palette.text.primary }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="550px"
        >
          <CircularProgress size={32} sx={{ color: isDark ? "#0a84ff" : "#0071e3" }} />
        </Box>
      ) : (
        <div style={{ height: "620px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      )}

      {selectedEvent && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 750,
              color: isDark ? "#409cff" : "#0071e3",
              fontSize: "1.1rem",
            }}
          >
            Event Details
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              {selectedEvent.title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
              <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
              <strong>End:</strong> {selectedEvent.end.toLocaleString()}
            </Typography>
            {selectedEvent.status && (
              <Box mt={1.5}>
                <Chip
                  label={`Status: ${selectedEvent.status}`}
                  color="primary"
                  size="small"
                  sx={{ borderRadius: "6px" }}
                />
              </Box>
            )}
            {selectedEvent.assignedMember && (
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.primary }}>
                <strong>Assigned To:</strong> {selectedEvent.assignedMember}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              variant="contained"
              size="small"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default DashboardCalendar;
