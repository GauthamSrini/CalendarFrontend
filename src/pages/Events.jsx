import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import seedEvents from "../assets/events.json";
import "../styles/Events.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Modal,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("events");
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents(seedEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const today = dayjs();

  const [draft, setDraft] = useState({
    title: "",
    date: today,
    start: today.hour(8).minute(0),
    end: today.hour(9).minute(0),
    completion_status: 0,
  });

  const resetDraft = () => {
    setError("");
    setDraft({
      title: "",
      date: today,
      start: today.hour(8).minute(0),
      end: today.hour(9).minute(0),
      completion_status: 0,
    });
  };

  const handleAdd = () => {
    const dateStr = draft.date.format("YYYY-MM-DD");
    const startStr = draft.start.format("HH:mm");

    const duplicate = events.find(
      (e) => e.date === dateStr && e.start_time === startStr
    );
    if (duplicate) {
      setError("Another event exists at the same date & time");
      return;
    }

    const newEvt = {
      title: draft.title,
      date: dateStr,
      start_time: startStr,
      end_time: draft.end.format("HH:mm"),
      completion_status: 0,
    };
    setEvents((prev) => [...prev, newEvt]);
    setOpen(false);
    resetDraft();

    toast.success("Event Added Successfully", {
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress-success",
    });
  };

  const statusChip = (status) =>
    status === 1 ? (
      <div
        style={{
          padding: "3px 8px",
          backgroundColor: "#F6FAF3",
          borderLeft: "3px solid #4CAF50",
        }}
      >
        Completed
      </div>
    ) : (
      <div
        style={{
          padding: "3px 8px",
          backgroundColor: "#FEF8E8",
          borderLeft: "3px solid #FEE5A5",
        }}
      >
        Pending
      </div>
    );

  return (
    <div className="events-page">
      {/* page header */}
      <Box className="events-header">
        <Typography
          style={{
            fontFamily: "poppins",
            fontSize: "18px",
            borderLeft: "3px solid #59AF32",
            paddingLeft: "10px",
          }}
          fontWeight={500}
        >
          Manage Events
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Box>Only you can control your future 💚</Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: "none", bgcolor: "#6948CB" }}
            onClick={() => setOpen(true)}
          >
            Add Event
          </Button>
        </Box>
      </Box>

      {/* event cards */}
      <Box className="events-grid">
        {events.length === 0 ? (
          <Typography>No events yet.</Typography>
        ) : (
          events.map((e, idx) => (
            <Card key={idx} className="event-card" variant="outlined">
              <CardContent>
                <Typography fontWeight={600} mb={0.5}>
                  {e.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(e.date).format("MMM D, YYYY")}
                </Typography>
                <Typography variant="body2" mb={1}>
                  {dayjs(`${e.date} ${e.start_time}`).format("h:mm A")} –{" "}
                  {dayjs(`${e.date} ${e.end_time}`).format("h:mm A")}
                </Typography>
                {statusChip(e.completion_status)}
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* add-event modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetDraft();
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,.15)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#6948CB",
              color: "#fff",
              px: 2,
              py: 1,
            }}
          >
            <Typography fontWeight={500}>Add Event</Typography>
            <IconButton
              size="small"
              sx={{ color: "#fff" }}
              onClick={() => {
                setOpen(false);
                resetDraft();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <TextField
              label="Title"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={draft.date}
                onChange={(v) => setDraft({ ...draft, date: v })}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TimePicker
                  label="Start"
                  value={draft.start}
                  onChange={(v) => setDraft({ ...draft, start: v })}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
                <TimePicker
                  label="End"
                  value={draft.end}
                  onChange={(v) => setDraft({ ...draft, end: v })}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Box>
            </LocalizationProvider>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#6948CB", textTransform: "none" }}
                disabled={!draft.title.trim()}
                onClick={handleAdd}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Events;
