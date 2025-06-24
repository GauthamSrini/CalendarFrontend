import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import img from '/icon-pic.png'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';

const SideNavBar = () => {

  return (
    <Sidebar
      className="sideBar"
      width="180px"
      collapsed={false}
      collapsedWidth="55px"
    >
      <Menu className="menu-vertical">
        <div>
          <div className="projectTitle">
            <div><img src={img} alt="" /></div>
            <div>World of Plans</div>
          </div>
          <MenuItem
            className="menuitemuni"
            icon={<HomeOutlinedIcon />}
            component={<NavLink to="/" />}
          >
            {" "}
            Home{" "}
          </MenuItem>
          <div className="subtitle">Manage</div>
          <MenuItem
            className="menuitemuni"
            icon={<EventNoteOutlinedIcon />}
            component={<NavLink to="/events" />}
          >
            {" "}
            Events{" "}
          </MenuItem>
        </div>
      </Menu> 
    </Sidebar>
  );
};

export default SideNavBar;
