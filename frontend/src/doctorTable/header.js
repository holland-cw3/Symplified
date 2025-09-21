import { Typography, Button } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react";


export default function(){
      const { logout, user } = useAuth0();

    return(
         <div

        className="header"
      >
        <Typography variant="h6">
          <strong>Hello {user?.name}!</strong>
        </Typography>
        <Typography variant="h6">
          <strong>Symplified</strong>
        </Typography>
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