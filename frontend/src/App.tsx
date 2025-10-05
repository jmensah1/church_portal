import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Services from './pages/Services';
import Attendance from './pages/Attendance';
import Churchdays from './pages/Churchdays';
import churchTheme from './theme/theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={churchTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/services" element={<Services />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/churchdays" element={<Churchdays />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
