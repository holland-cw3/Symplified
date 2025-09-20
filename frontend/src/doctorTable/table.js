import './getStarted.css';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import img from './image.png';
import { useAuth0 } from '@auth0/auth0-react';




function PatientCard() {
  return (
    <Card sx={{ width: '20vw' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={img}
        title="green iguana"
      />
      <CardContent>
        <ul>
            <li>Patient Name: Caleb Holland</li>
            <li>Wait Time: 1 hr 20 min</li>
            <li>Severity Score: 7/10</li>
            <li>Symptoms: e,e,e,e,e,</li>
        </ul>
      </CardContent>
      <CardActions>
        <Button size="small" variant='contained'>View File</Button>
      </CardActions>
    </Card>
  );
}




export default function Table() {
  const { logout, isAuthenticated, user } = useAuth0();

  return (
    <div className='getStarted'>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', marginBottom: '1rem' }}>
        <h2>Doctor Dashboard</h2>
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>Signed in as {user?.name}</div>
            <Button variant="contained" color="secondary" onClick={() => logout({ returnTo: window.location.origin + '/doctorlogin' })}>
              Log Out
            </Button>
          </div>
        )}
      </div>

      <PatientCard />
    </div>
  );
}
