import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import './doctorLogin.css';
import { Fade } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

const steps = [
    'Doctor Login'
];

export default function LoginScreen() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  
  let show = true
  console.log(isAuthenticated)
  return (
    <div className="getStarted">
      {(
        !isAuthenticated ? (
          <Fade in={show} timeout={500}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '32px',
                  textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)',
                  textAlign: 'center',
                }}
              >
                Doctor Login
              </Typography>

              <Button
                style={{ marginTop: 20 }}
                variant="contained"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { redirect_uri: window.location.origin + "/doctor" },
                  })
                }
              >
                Log In
              </Button>
            </div>
          </Fade>
        ) : 
          <Fade in={show} timeout={500}>
            <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }} >
                Unable to Authenticate
            </Typography>
          </Fade>
      )}
    </div>
  );
}