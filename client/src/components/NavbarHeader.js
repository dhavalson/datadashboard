import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust path based on your folder structure
import { FaBars, FaHome, FaSignOutAlt, FaComments } from 'react-icons/fa';

const NavbarHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const [userClick, setUserClick] = useState('False');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleUserClick = () => {
    setUserClick('True');

  }

  return (
    <header style={styles.headerContainer}>
      {/* Left Section: Menu Toggle & Logo */}
      <div style={styles.leftSection}>
        <button style={styles.menuBtn} onClick={toggleSidebar} title="Toggle Sidebar">
          <FaBars size={18} color="#0052cc" />
        </button>
        <div style={styles.logoBox}>
          <span style={styles.logoIcon}>XY</span>
          <span style={styles.logoText}>XY | XX</span>
        </div>
        <div style={styles.userBadge}>
          {user?.name || user?.username || 'XYXX Admin'}
        </div>
      </div>

      {/* Center Section: Online Indicator */}
      <div style={styles.centerSection}>
        <span style={styles.onlineBadge}>Online</span>
      </div>

      {/* Right Section: Navigation Links & Logout */}
      <div style={styles.rightSection}>
        <div style={styles.navItem} onClick={() => window.location.href = '/dashboard'}>
          <FaHome size={18} color="#ff7a00" />
          <span style={{ color: '#ff7a00' }}>Home</span>
        </div>

        <div style={styles.navItem}>
          <FaComments size={18} color="#00a65a" />
          <span style={{ color: '#00a65a' }}>Chat</span>
        </div>

        <div
          style={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div style={styles.userAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%', // Positioned directly at the bottom edge of the avatar
                right: 0,
                // Removed marginTop: '8px' to eliminate the empty gap
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '6px',
                padding: '8px 0',
                zIndex: 1000,
                minWidth: '120px'
              }}
            >

              <ul style={styles.navItem} onClick={handleLogout}>
                <FaSignOutAlt size={21} color="#dd4b39" />
                <span style={{ color: '#dd4b39' }}>Logout</span>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  headerContainer: {
    height: '55px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  leftSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  menuBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #333',
    padding: '2px 8px',
    fontWeight: 'bold',
    fontSize: '14px',
    gap: '6px'
  },
  logoIcon: { backgroundColor: '#000', color: '#fff', padding: '0 4px', borderRadius: '2px' },
  logoText: { letterSpacing: '1px' },
  userBadge: {
    backgroundColor: '#eee',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#333',
    fontWeight: '500'
  },
  centerSection: { display: 'flex', justifyContent: 'center' },
  onlineBadge: {
    backgroundColor: '#008a00',
    color: '#fff',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#555',
    backgroundColor: '#f9f9f9'
  }
};

export default NavbarHeader;