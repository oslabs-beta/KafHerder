import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/homepage' element={<Homepage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
