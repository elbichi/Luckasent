import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import Dashboard from "./components/Dashboard/Dashboard"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/admin/users"element={<Dashboard />} />
    
      </Routes>
    </Router>
  );
}

export default App;