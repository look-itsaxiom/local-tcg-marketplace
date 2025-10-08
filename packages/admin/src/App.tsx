import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import InventoryManagementPage from './pages/InventoryManagementPage';
import SellersPage from './pages/SellersPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryManagementPage />} />
            <Route path="/sellers" element={<SellersPage />} />
            <Route path="/pos-integrations" element={<DashboardPage />} />
          </Routes>
        </main>
        <footer style={styles.footer}>
          <p>© 2024 Local TCG Marketplace Admin Portal</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },
  main: {
    flex: 1,
    paddingBottom: '40px',
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto',
  },
};

export default App;
