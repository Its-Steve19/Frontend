import React from "react";
import "./sidenav.css";
// import gigitise from '../../../../public/gigitise.svg';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  MdAdd,
  MdTaskAlt,
  MdPendingActions,
  MdAccessTime,
} from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { useOrderContext } from "../../../providers/OrderProvider";

const styleFunc = ({ isActive }) => {
  return {
    backgroundColor: isActive ? "#404c5e" : "",
    color: isActive ? "#fff" : "",
  };
};

const SideNav = () => {
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { ordersAvailable, ordersInProgress } = useOrderContext();

  const iconSize = 22;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // if (
  //   currentUrl.split("/").includes("order") &&
  //   windowWidth > 900 &&
  //   windowWidth < 1200
  // ) {
  //   setShowSideBar(false);
  // }

  return (
    <>
      {showSideBar || windowWidth > 900 ? (
        <div
          className={`side-nav ${
            showSideBar ? "show-side-bar" : "hide-side-bar"
          }`}
        >
          {windowWidth <= 900 && (
            <div className="hide-icon">
              <RiArrowLeftSLine
                color="#fff"
                onClick={() => setShowSideBar(false)}
                size={iconSize}
              />
            </div>
          )}
          <h1
            style={{ cursor: "pointer" }}
            className="heading-logo"
            onClick={() => navigate("./")}
          >
            Gigitise
          </h1>
          <div className="actions">
            <NavLink to="/" className="nav-item" activeClassName="active-link">
              <div>
                <span>
                  <FiMenu size={iconSize} />
                </span>
                <span>Dashboard</span>
              </div>
            </NavLink>
            <NavLink to="./available" className="nav-item" style={styleFunc}>
              <div>
                <span>
                  <FaClockRotateLeft size={iconSize} />
                </span>
                <span>Bidding</span>
              </div>
              <span className="count">{ordersAvailable.count}</span>
            </NavLink>
            <NavLink to="./in-progress" className="nav-item" style={styleFunc}>
              <div>
                <span>
                  <MdPendingActions size={iconSize} />
                </span>
                <span>In Progress</span>
              </div>
              <span className="count">{ordersInProgress.count}</span>
            </NavLink>
            <NavLink to="./completed" className="nav-item" style={styleFunc}>
              <div>
                <span>
                  <MdTaskAlt size={iconSize} />
                </span>
                <span>Completed</span>
              </div>
            </NavLink>
            <NavLink to="./solved" className="nav-item" style={styleFunc}>
              <div>
                <span>
                  <MdAccessTime size={iconSize} />
                </span>
                <span>Solved</span>
              </div>
            </NavLink>
            <NavLink to="./create-task" className="nav-item" style={styleFunc}>
              <div>
                <span>
                  <MdAdd size={iconSize} />
                </span>
                <span>Create</span>
              </div>
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="show-icon">
          <RiArrowRightSLine
            color="#fff"
            onClick={() => setShowSideBar(true)}
            size={iconSize}
          />
        </div>
      )}
    </>
  );
};

export default SideNav;
