import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './survey/getStarted.js';
import Survey from './survey/survey.js';
import Symptoms from './survey/Symptoms.js';
import Camera from './survey/Camera.js';
import Audio from './survey/Audio.js';

import More from './survey/more.js';
import Thanks from './survey/Thanks.js';
import Doctor from './doctorTable/table.js'

import LoginScreen from './doctorTable/login.js'

import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import BasicInfo from './survey/basicInfo.js'


function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/doctorlogin" />;
}


export default function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start/>}></Route>
      <Route path='/survey' element={<Survey/>}></Route>
      <Route path='/symptoms' element={<Symptoms/>}></Route>
      <Route path='/camera' element={<Camera/>}></Route>
      <Route path='/audio' element={<Audio/>}></Route>

      <Route path='/moresymptoms' element={<More/>}></Route>
      <Route path='/thanks' element={<Thanks/>}></Route>

      <Route path='/doctorlogin' element={<LoginScreen/>}></Route>
      <Route path='/doctor' element={
          <ProtectedRoute>
            <Doctor />
          </ProtectedRoute>
        } 
      />
    </Routes>
    </BrowserRouter>
  );
}