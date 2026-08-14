import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // 1. Tumiza axios hano

// 2. Shyiraho Base URL na Interceptor hano hanze ya App component
axios.defaults.baseURL = 'https://lost-and-gain-backen...onrender.com'; // Shyiramo URL yawe nya yo ya Render

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Izina ry'aho ubika token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllAnnounced from './pages/ALLAnnounced';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Map from './pages/Map';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/all-announced" element={<AllAnnounced />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<Map />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;
