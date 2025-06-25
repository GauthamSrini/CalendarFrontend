import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import "../styles/Home.css";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("events");
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      fetch("/events.json")
        .then((r) => r.json())
        .then((data) => setEvents(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const today = dayjs();
  const todayEvents = events.filter((event) =>
    dayjs(event.date).isSame(today, "day")
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");
  const [newEvt, setNewEvt] = useState({
    title: "",
    date: today, // dayjs object
    start: today.hour(8).minute(0),
    end: today.hour(17).minute(0),
    completion_status: 0,
  });

  const resetForm = () => {
    setError("");
    setNewEvt({
      title: "",
      date: today,
      start: today.hour(8).minute(0),
      end: today.hour(17).minute(0),
      completion_status: 0,
    });
  };

  const handleAddEvent = () => {
    /* convert to strings for comparison */
    const dateStr = newEvt.date.format("YYYY-MM-DD");
    const startStr = newEvt.start.format("HH:mm");

    const duplicate = events.find(
      (e) => e.date === dateStr && e.start_time === startStr
    );

    if (duplicate) {
      setError("Another event exists at the same date and time!");
      return;
    }

    const formatted = {
      title: newEvt.title,
      date: dateStr,
      start_time: startStr,
      end_time: newEvt.end.format("HH:mm"),
      completion_status: 0,
    };

    setEvents((prev) => [...prev, formatted]);
    setOpenAdd(false);
    resetForm();
  };

  return (
    <div className="home-container">
      {/* Top Section - Today Overview */}
      <div className="today-summary">
        <div className="today-date">
          {/* <span>Today:</span> {today.format("dddd, MMMM D, YYYY")} */}
          <div>
            <div className="Today-Day">{today.format("dddd")}</div>
            <div className="dateMY">{today.format("D MMMM YYYY")}</div>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontStyle: "italic" }}>
              Schedule your Priorities 💚
            </div>
            <div className="editEventBtn">
              <EditNoteOutlinedIcon onClick={() => setOpenAdd(true)} /> Add
              Event
            </div>
          </div>
        </div>
        <div className="eventsTitle">Events</div>
        <div className="today-events">
          {todayEvents.length === 0 ? (
            <div className="no-events">No events today</div>
          ) : (
            todayEvents.map((event, idx) => (
              <div className="event-title" key={idx}>
                <div>{event.title}</div>
                <div>
                  {dayjs(`${event.date} ${event.start_time}`).format("h:mm A")}{" "}
                  - {dayjs(`${event.date} ${event.end_time}`).format("h:mm A")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <div className="fullEventTitle">
            Full Event Schedule{" "}
            <span className="monthSpan">{currentDate.format("MMMM YYYY")}</span>
          </div>
          <div className="calendar-nav">
            <button
              className="NavigationIconDiv"
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            >
              <NavigateBeforeOutlinedIcon className="NavigationIcon" />
            </button>
            <button onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
              <NavigateNextOutlinedIcon className="NavigationIcon" />
            </button>
          </div>
        </div>
        <Calendar currentDate={currentDate} events={events} />
      </div>
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.15)",
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
            boxShadow: 24,
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {/* yellow ribbon header */}
          <Box
            sx={{
              bgcolor: "#6948CB",
              color: "#fff",
              px: 2,
              py: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={500}>
              {newEvt.date.format("dddd, MMMM D, YYYY")}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <TextField
              label="Add a title"
              fullWidth
              size="small"
              value={newEvt.title}
              onChange={(e) => setNewEvt({ ...newEvt, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
                value={newEvt.date}
                onChange={(val) => setNewEvt({ ...newEvt, date: val })}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TimePicker
                  label="Start"
                  value={newEvt.start}
                  onChange={(v) => setNewEvt({ ...newEvt, start: v })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <TimePicker
                  label="End"
                  value={newEvt.end}
                  onChange={(v) => setNewEvt({ ...newEvt, end: v })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            </LocalizationProvider>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#6948CB",
                  textTransform: "none",
                  padding: "1px 5px",
                }}
                onClick={handleAddEvent}
                disabled={!newEvt.title.trim()}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
