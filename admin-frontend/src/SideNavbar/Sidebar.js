import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaGooglePlusG, FaYoutube } from 'react-icons/fa';
import { FiChevronRight, FiChevronLeft, FiMenu, FiHome, FiAlertCircle, FiInfo } from 'react-icons/fi';

// Define your icons as functional components
const HomeIcon = () => <FiHome />;
const DashboardIcon = () => <FiMenu />; // Replace with appropriate icon
// Define other icons similarly

const LinkItems = [
  { name: 'Home', icon: HomeIcon, path: '/Home' },
  { name: 'Dashboard', icon: DashboardIcon, path: '/Dashboard' },
  // Add other links similarly
];

const SocialMediaLinks = () => (
  <div>
    <a href="#"><FaFacebookF /></a>
    <a href="#"><FaTwitter /></a>
    <a href="#"><FaInstagram /></a>
    <a href="#"><FaLinkedin /></a>
    <a href="#"><FaGooglePlusG /></a>
    <a href="#"><FaYoutube /></a>
  </div>
);

const NavItem = ({ icon: Icon, children, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Link to={path || '#'} onClick={() => setIsOpen(false)}>
        <div>{Icon && <Icon />}{children}</div>
      </Link>
      {isOpen && (
        <div>
          {/* Render subitems here if needed */}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', display: 'flex' }}>
      <div style={{ width: isSidebarOpen ? '240px' : '0', transition: 'width 0.3s ease' }}>
        <div style={{ padding: '20px' }}>
          <h1>Logo</h1>
          {LinkItems.map((item, index) => (
            <NavItem key={index} icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center' }}>
          {/* Optional: Add social media links */}
          <SocialMediaLinks />
        </div>
      </div>
      <div style={{ marginLeft: isSidebarOpen ? '240px' : '0', transition: 'margin-left 0.3s ease', flexGrow: 1 }}>
        {/* Main content goes here */}
      </div>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          left: isSidebarOpen ? '240px' : '0',
          zIndex: '1000'
        }}
      >
        {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;
