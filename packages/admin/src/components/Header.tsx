import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            🔧 TCG Marketplace Admin
          </Link>
        </h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/inventory" style={styles.navLink}>
            Inventory
          </Link>
          <Link to="/sellers" style={styles.navLink}>
            Sellers
          </Link>
          <Link to="/pos-integrations" style={styles.navLink}>
            POS Integrations
          </Link>
        </nav>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'opacity 0.2s',
  },
};

export default Header;
