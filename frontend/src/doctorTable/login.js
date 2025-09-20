import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

export default function LoginScreen() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20vh" }}>
      <h1>Doctor Login</h1>

      {!isAuthenticated ? (
        <Button variant="contained" onClick={() => loginWithRedirect({
          authorizationParams: { redirect_uri: window.location.origin + "/doctor" }
        })}>
          Log In
        </Button>
      ) : (
        <>
          <p>Welcome, {user.name}</p>
          <Button variant="contained" onClick={() => logout({ returnTo: window.location.origin + "/doctorlogin" })}>
            Log Out
          </Button>
        </>
      )}
    </div>
  );
}