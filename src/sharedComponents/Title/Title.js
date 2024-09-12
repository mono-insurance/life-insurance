import React from 'react'
import { MdOutlineMenu, MdOutlineHome } from "react-icons/md";
import { useContext } from "react";
import { SidebarContext } from '../../context/SidebarContext';
import "./title.scss";
import { NavLink } from 'react-router-dom';

export const AreaTop = ({ pageTitle, pagePath, pageLink}) => {
    const { openSidebar } = useContext(SidebarContext);
  
    return (
      <section className="content-area-top">
        <div className="area-top-l">
          <div className="title-and-button">
            <button
              className="sidebar-open-btn"
              type="button"
              onClick={openSidebar}
            >
              <MdOutlineMenu size={24} />
            </button>
            <h2 className="area-top-title">{ pageTitle }</h2>
          </div>
          <div className="area-top-path">
            <NavLink to={ pageLink }>
                <span className="page-path-icon">
                  <MdOutlineHome size={18} />
                </span>
            </NavLink>
            <span className="page-path-text">/ { pagePath }</span>
          </div>
        </div>
      </section>
    );
  };