import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './survey/getStarted.js';
import Survey from './survey/survey.js';
import Symptoms1 from './survey/Symptoms1.js';
import Camera from './survey/Camera.js';
import Audio from './survey/Audio.js';

import More from './survey/more.js';
import Thanks from './survey/Thanks.js';





export default function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start/>}></Route>
      <Route path='/survey' element={<Survey/>}></Route>
      <Route path='/symptoms1' element={<Symptoms1/>}></Route>
      <Route path='/camera' element={<Camera/>}></Route>
      <Route path='/audio' element={<Audio/>}></Route>

      <Route path='/moresymptoms' element={<More/>}></Route>
      <Route path='/thanks' element={<Thanks/>}></Route>








      {/* <Route path='/doctor' element={Doctor}></Route> */}
    </Routes>
    </BrowserRouter>
  );
}