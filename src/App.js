import React from 'react';
import Auth from './components/Auth/Auth.js';
import Home from './components/Home/Home.js';
import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  // const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/auth/:type" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route exact path="/" element={<Navigate to="auth/sign-in" />}></Route>
      </Routes>
    </div>
  );
}

export default App;
