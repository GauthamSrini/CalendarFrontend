import React, { useState } from "react";
import dayjs from "dayjs";
import "../styles/Calendar.css";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";

// Extend dayjs to use ISO weeks (starting from Monday)
dayjs.extend(isoWeek);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

const Calendar = ({ currentDate, events }) => {
  const [selectedEvent, setSelectedEvent] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const startDay = startOfMonth.startOf("isoWeek");
  const endDay = endOfMonth.endOf("isoWeek");

  const calendarDays = [];
  let day = startDay;

  while (day.isBefore(endDay, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  const getEventsForDay = (date) =>
    events.filter((e) => dayjs(e.date).isSame(date, "day"));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  return (
    <div className="calendar-grid">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
        <div key={d} className="calendar-day-header">
          {d}
        </div>
      ))}
      {calendarDays.map((date, index) => {
        const dayEvents = getEventsForDay(date);
        const isToday = date.isSame(dayjs(), "day");
        const isThisMonth = date.isSame(currentDate, "month");

        return (
          <div
            key={index}
            className={`calendar-cell ${!isThisMonth ? "dimmed" : ""} ${
              isToday ? "today-highlight" : ""
            }`}
          >
            <div
              className={`calendar-date ${!isThisMonth ? "dimmed" : ""} ${
                isToday ? "today-highlight-date" : ""
              }`}
            >
              {date.date()}
            </div>
            {dayEvents.map((event, idx) => (
              <div
                key={idx}
                className="calendar-event"
                onClick={() => handleEventClick(event)}
                style={{
                  backgroundColor:
                    event.completion_status === 0
                      ? "#FEF8E8"
                      : event.completion_status === 1
                      ? "#F6FAF3"
                      : "#F7F7F7",
                  borderLeftColor:
                    event.completion_status === 0
                      ? "#FEE5A5"
                      : event.completion_status === 1
                      ? "#4CAF50"
                      : "#DEDEDE",
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        );
      })}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h7">Event</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h" fontWeight="600">
            {selectedEvent.title}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            mt={2}
            sx={{ color: "#68667D" }}
          >
            <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography>
              {dayjs(
                `${selectedEvent.date} ${selectedEvent.start_time}`
              ).format("h:mm A")}{" "}
              →{" "}
              {dayjs(`${selectedEvent.date} ${selectedEvent.end_time}`).format(
                "h:mm A"
              )}
            </Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            mt={1}
            sx={{ color: "#68667D" }}
          >
            <CalendarTodayIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography>
              {dayjs(selectedEvent.date).format("MMM D, ddd")}
            </Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            mt={1}
            sx={{ color: "#68667D" }}
          >
            <PublicIcon sx={{ fontSize: 20, mr: 1 }} />
            <Typography>GMT+5:30 Kolkata</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button
            fullWidth
            sx={{
              backgroundColor:
                selectedEvent.completion_status === 0
                  ? "#FEF8E8"
                  : selectedEvent.completion_status === 1
                  ? "#F6FAF3"
                  : "#F7F7F7",
              borderLeft:
                selectedEvent.completion_status === 0
                  ? "3px solid #FEE5A5"
                  : selectedEvent.completion_status === 1
                  ? "3px solid #4CAF50"
                  : "#DEDEDE",
              borderRadius: "5px",
              color: "black",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {selectedEvent.completion_status === 1 ? "Completed" : "Pending"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Calendar;
