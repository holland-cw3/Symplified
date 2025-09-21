import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './survey/getStarted.js';
import BasicInfo from './survey/basicInfo.js';
import Symptoms from './survey/Symptoms.js';
import Camera from './survey/Camera.js';

import More from './survey/more.js';
import Thanks from './survey/Thanks.js';
import Doctor from './doctorTable/table.js'
import PatientFile from './doctorTable/profile.js';

import LoginScreen from './doctorTable/login.js'

import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";


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
      <Route path='/symptoms' element={<Symptoms/>}></Route>
      <Route path='/camera' element={<Camera/>}></Route>

      <Route path='/moresymptoms' element={<More/>}></Route>
      <Route path='/thanks' element={<Thanks/>}></Route>
      <Route path='/basics' element={<BasicInfo/>}></Route>

      <Route path='/doctorlogin' element={<LoginScreen/>}></Route>
      {/* { <Route path='/doctor' element={
          <ProtectedRoute>
            <Doctor />
          </ProtectedRoute>
        } 
      /> } */}

      <Route path='/doctor' element={<Doctor/>}></Route>
      <Route path='/patientfile' element={<PatientFile/>}></Route>



    </Routes>
    </BrowserRouter>
  );
}