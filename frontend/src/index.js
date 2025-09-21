import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import Bear from './bear';
import bear1 from './cute_bear.png';
import bear2 from './nurse_bear.png';
import bear3 from './surgeon_bear.png';


const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = createRoot(document.getElementById('root'));

const bearWidth = 125;
const windowWidth = window.innerWidth;

const getRandomX = (occupied = []) => {
  let x;
  const minDistance = 150; // minimum distance between bears
  do {
    x = Math.random() * (windowWidth - bearWidth);
  } while (occupied.some(pos => Math.abs(pos - x) < minDistance));
  occupied.push(x);
  return x;
};

const occupiedPositions = [];
const startPositions = [
  getRandomX(occupiedPositions),
  getRandomX(occupiedPositions),
  getRandomX(occupiedPositions),
];

root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin + '/doctor' }}
    >
      <Bear imgSrc={bear1} size={125} speed={30} startX={startPositions[0]} />
      <Bear imgSrc={bear2} size={125} speed={30} startX={startPositions[1]} />  
      <Bear imgSrc={bear3} size={125} speed={30} startX={startPositions[2]} />
      <App />   {/* Routes inside App */}
    </Auth0Provider>
);