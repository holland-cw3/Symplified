import { Typography, Button } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../logo.png"
import './doc.css';
import { useNavigate } from 'react-router-dom';


export default function(){
      const { logout, user } = useAuth0();
      const navigate = useNavigate();

    return(
         <div className="header">
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Typography variant="h6">
                <strong>Hello, {user?.name}!</strong>
              </Typography>
            </div>

            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <img
                src={logo}
                alt="Symplified Logo"
                style={{ height: "55px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => navigate("/doctor")}
              />
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Button
                variant="outlined"
                onClick={() =>
                  logout({ returnTo: window.location.origin + "/doctorlogin" })
                }
              >
                Log Out
              </Button>
            </div>
          </div>
    )
}