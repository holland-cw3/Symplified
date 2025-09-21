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
  const [index, setIndex] = useState(0);
  const [startButton, setStartButton] = useState(false);
  const [show, setShow] = useState(true);
  
  
  useEffect(() => {
      if (index < steps.length - 1) {
          const timeout = setTimeout(() => {
              setShow(false);
          }, 1500);
          return () => clearTimeout(timeout);
      } else {
          setShow(true);
          setStartButton(true);
      }
  }, [index]);
  
  useEffect(() => {
      if (!show && index < steps.length - 1) {
          const timeout = setTimeout(() => {
              setIndex(index + 1);
              setShow(true);
          }, 1000);
          return () => clearTimeout(timeout);
      }
      if (index === steps.length - 1) {
          setStartButton(true);
      }
  }, [show, index]);

  return (
    <div className="getStarted">
      <Fade in={show} timeout={500}>
          <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }} >
              {steps[index]}
          </Typography>
      </Fade>

      {startButton && (
        !isAuthenticated ? (
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
        ) : (
          <>
            <p>Welcome, {user.name}</p>
            <Button
              variant="contained"
              onClick={() =>
                logout({ returnTo: window.location.origin + "/doctorlogin" })
              }
            >
              Log Out
            </Button>
          </>
        )
      )}
    </div>
  );
}