import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SignUp from "./companents/SignUpSignIn/SignUp"
import Dashboard from './companents/AI/Dashboard'
import SignIn from './companents/SignUpSignIn/SignIn'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './companents/config/firebase'
export default function App() {
  const navigate = useNavigate()
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        navigate('/')
      } else {

        navigate('/login')
      }
    });

    return () => unsubscribe();
  }, []);
  console.log("%cSardorDev", "color: blue; font-famely:monospace; font-size: 40px; font-weight: bold;", 'tomonidan yaratildi');

  return (
    <>
    
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<SignIn />} />
      </Routes>
    </>
  )
}
