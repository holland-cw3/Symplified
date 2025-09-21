import { Typography, Button } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../logo.png"
import './doc.css';

export default function(){
      const { logout, user } = useAuth0();

    return(
         <div

        className="header"
      >
        <Typography variant="h6" style={{ minWidth: "250px" }}> 
          <strong>Hello, {user?.name}!</strong>
        </Typography>
        <div style={{ height: "40px", display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
        <img 
          src={logo} 
          alt="Symplified Logo" 
          style={{ height: "140%", objectFit: "contain" }}
        />
      </div>
        <div>
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