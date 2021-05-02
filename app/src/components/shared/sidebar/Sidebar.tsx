import React from 'react';
import './Sidebar.scss';
import SidebarMenuItems from './SidebarMenuItems';

export default ({ title }) => {
  return (
    <div className="Sidebar">
      <div className="header">
        <div className="header-content">
          <label htmlFor="openSidebarMenu" className="toggle-sidebar-icon">
            <div className="spinner diagonal part-1"></div>
            <div className="spinner horizontal"></div>
            <div className="spinner diagonal part-2"></div>
          </label>

          <a href="/">
            { title }
          </a>

        </div>
      </div>
      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" />
      
      <div id="sidebarMenu">
        <SidebarMenuItems />
      </div>
    </div>
  );
};
