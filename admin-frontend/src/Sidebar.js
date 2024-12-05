import React, { useState } from "react";
import "./Sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import { Link } from "react-router-dom";
import { useUser } from "./SideItems/UserContext";

const Sidebar = ({ isSidebarOpen, toggleSidebar, sidebarWidth = 250 }) => {
  // const [isSidebarOpen, setisSidebarOpen] = useState(false);
  const [featOpen, setFeatOpen] = useState(false); // State for submenu
  const [hoveredItem, setHoveredItem] = useState(null);

  // const toggleSidebar = () => {
  //     setisSidebarOpen(!isSidebarOpen);
  // };a

  const toggleSubMenu = () => {
    setFeatOpen(!featOpen);
  };

  const sidebarStyle = {
    width: `${sidebarWidth}px`,
    height: "100%",
    position: "fixed",
    transition: "all 0.5s ease",
    left: isSidebarOpen ? "0px" : `-${sidebarWidth - 70}px`,

    marginTop: "-75px",
    zIndex: "1000",
    borderRight: "2px solid #ddd",
  };

  const barStyle = {
    position: "fixed",
    top: "10px",
    left: isSidebarOpen ? `${sidebarWidth + 10}px` : "80px",
    cursor: "pointer",
    transition: "left 0.3s ease-in-out", // Increased from 0.3s to 0.7s
    height: "30px",
    width: "30px",
    zIndex: "1100",
  };

  const iconStyle = {
    marginRight: "20px",
    marginLeft: isSidebarOpen ? "-28px" : "150px",
  
    transition: "margin 0.7s ease-in-out", // Increased from 0.3s to 0.7s
  };

  const itemsStyle = {
    opacity: isSidebarOpen ? 1 : 0,

 
    transition: "opacity 0.7s ease-in-out", // Increased from 0.3s to 0.7s
  };

  const subItems = {
    marginLeft: isSidebarOpen ? "0px" : "220px",
    marginTop: isSidebarOpen ? "0px" : "-27px",
    marginBottom: isSidebarOpen ? "0px" : "-64px",
    transition: "all 0.7s ease-in-out", // Increased from 0.3s to 0.7s
  };
  return (
    <div>
      <div className={`container ${isSidebarOpen ? "open" : ""}`}>
        <img
          className={`bar ${isSidebarOpen ? "click" : ""}`}
          onClick={toggleSidebar}
          src="https://icons.iconarchive.com/icons/icons8/windows-8/128/Very-Basic-Menu-icon.png"
          width="128"
          style={barStyle}
          height="128"
          alt="menu icon"
        />
        <header className="header">
          <div className="logo"></div>
          <nav className="nav-links">
            <div className="effect claudio">
              <div className="buttons1">
                <a href="#" className="fb" title="Join us on Facebook">
                  <i className="fab fa-facebook" aria-hidden="true"></i>
                </a>
                <a href="#" className="tw" title="Join us on Twitter">
                  <i className="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#" className="g-plus" title="Join us on Google+">
                  <i className="fab fa-google-plus" aria-hidden="true"></i>
                </a>
                <a href="#" className="dribbble" title="Join us on Dribbble">
                  <i className="fab fa-dribbble" aria-hidden="true"></i>
                </a>
                <a href="#" className="vimeo" title="Join us on Vimeo">
                  <i className="fab fa-vimeo" aria-hidden="true"></i>
                </a>
                <a href="#" className="pinterest" title="Join us on Pinterest">
                  <i className="fab fa-pinterest" aria-hidden="true"></i>
                </a>
                <a href="#" className="insta" title="Join us on Instagram">
                  <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a href="#" className="in" title="Join us on LinkedIn">
                  <i className="fab fa-linkedin" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </nav>
        </header>
        <nav
          style={sidebarStyle}
          className={`sidebar ${isSidebarOpen ? "show" : ""}`}
        >
          <div className="text">Logo</div>
          <ul>
            {/* <li>
                        <a
                                href="#"
                                className="feat-btn"
                                // onMouseEnter={() => setFeatOpen(true)}
                                // onMouseLeave={() => setFeatOpen(false)}
                               
                            >
                          
                                <img src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-3/128/home-icon.png" width="20" height="20" style={iconStyle} />
                                <p style={itemsStyle}>Home</p>
                                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: '20px' }} />
                            </a>
                           
                       
                           
                        </li> */}

          
         
            <li
              onMouseEnter={() => setHoveredItem("Dashboard")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Dashboard" className="nav-link">
                <img
                  src="https://icons.iconarchive.com/icons/icons8/windows-8/128/Programming-Dashboard-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Dashboard</span>
                {!isSidebarOpen && hoveredItem === "Dashboard" && (
                  <div className="item-tooltip">Dashboard</div>
                )}
              </Link>
            </li>


            <li
              onMouseEnter={() => setHoveredItem("Home")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Home" className="nav-link">
                <img
                  src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-3/128/home-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Home</span>
                {!isSidebarOpen && hoveredItem === "Home" && (
                  <div className="item-tooltip">Home</div>
                )}
              </Link>
            </li>


            <li
              onMouseEnter={() => setHoveredItem("Brands")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Brands" className="nav-link">
                <img
                src="https://icons.iconarchive.com/icons/custom-icon-design/flatastic-4/128/Shopping-bag-purple-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Brands</span>
                {!isSidebarOpen && hoveredItem === "Brands" && (
                  <div className="item-tooltip">Brands</div>
                )}
              </Link>
            </li>

          
       

            <li
              onMouseEnter={() => setHoveredItem("Makeup")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Makeup" className="nav-link">
                <img
                src="https://icons.iconarchive.com/icons/rade8/body-care/128/make-up-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Makeup</span>
                {!isSidebarOpen && hoveredItem === "Makeup" && (
                  <div className="item-tooltip">Makeup</div>
                )}
              </Link>
            </li>


            <li
              onMouseEnter={() => setHoveredItem("Skincare")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Skincare" className="nav-link">
                <img
                 src="https://icons.iconarchive.com/icons/dapino/beauty/128/creme-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Skincare</span>
                {!isSidebarOpen && hoveredItem === "Skincare" && (
                  <div className="item-tooltip">Skincare</div>
                )}
              </Link>
            </li>

            <li
              onMouseEnter={() => setHoveredItem("Haircare")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Haircare" className="nav-link">
                <img
                 src="https://icons.iconarchive.com/icons/dapino/beauty/128/face-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Haircare</span>
                {!isSidebarOpen && hoveredItem === "Haircare" && (
                  <div className="item-tooltip">Haircare</div>
                )}
              </Link>
            </li>

            <li
              onMouseEnter={() => setHoveredItem("Tools&Brushes")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Tools&Brushes" className="nav-link">
                <img
                 src="https://icons.iconarchive.com/icons/atyourservice/service-categories/128/Makeup-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={{ opacity: isSidebarOpen ? 1 : 0,transition: "opacity 0.7s ease-in-out",marginLeft:'-10px'}}> Tools & Brushes</span>
                {!isSidebarOpen && hoveredItem === "Tools&Brushes" && (
                  <div className="item-tooltip"> Tools & Brushes</div>
                )}
              </Link>
            </li>

            <li
              onMouseEnter={() => setHoveredItem("Fragrances")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/Fragrances" className="nav-link">
                <img
                src="https://icons.iconarchive.com/icons/dapino/beauty/128/perfume-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Fragrances</span>
                {!isSidebarOpen && hoveredItem === "Fragrances" && (
                  <div className="item-tooltip">Fragrances</div>
                )}
              </Link>
            </li>

            <li
              onMouseEnter={() => setHoveredItem("ContactUs")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to="/ContactUs" className="nav-link">
                <img
                src="https://icons.iconarchive.com/icons/graphicloads/100-flat-2/128/phone-icon.png"
                  width="20"
                  height="20"
                  style={iconStyle}
                />
                <span style={itemsStyle}>Contact Us</span>
                {!isSidebarOpen && hoveredItem === "ContactUs" && (
                  <div className="item-tooltip">Contact Us</div>
                )}
              </Link>
            </li>
            

   
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
