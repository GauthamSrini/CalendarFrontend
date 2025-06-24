import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import "../styles/Home.css";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const today = dayjs();
  const todayEvents = events.filter((event) =>
    dayjs(event.date).isSame(today, "day")
  );

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
          <div style={{display:'flex',gap:"20px",alignItems:"center"}}>
            <div style={{fontStyle:"italic"}}>Schedule your Priorities 💚</div>
            <div className="editEventBtn">
              <EditNoteOutlinedIcon /> Edit Event
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
    </div>
  );
};

export default Home;
