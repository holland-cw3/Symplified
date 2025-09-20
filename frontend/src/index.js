import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

console.log("Auth0 config:", domain, clientId);

const root = createRoot(document.getElementById('root'));

root.render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin + '/doctor' }}
    >
      <App />
    </Auth0Provider>
);