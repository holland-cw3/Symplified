import './doc.css';
import Button from '@mui/material/Button';
import img from './image.png';
import Typography from '@mui/material/Typography';

function PatientCard() {
  return (
    <div className='card'>
      <img src={img} sx={{ height: 10 }}></img>
      <table>
        <thead>
          <tr><th>Patient Name</th><th>Wait Time</th><th>Severity Score</th><th></th><th></th></tr>
        </thead>
        <tbody>
          <tr><td>Caleb Holland</td><td>1 hr 20 min</td><td>7/10</td><td><Button variant='contained'>See File</Button></td> <td><Button variant='contained' color='error'>X</Button></td></tr>
          <tr><td>Caleb Holland</td><td>1 hr 20 min</td><td>7/10</td><td><Button variant='contained'>See File</Button></td></tr>
          <tr><td>Caleb Holland</td><td>1 hr 20 min</td><td>7/10</td><td><Button variant='contained'>See File</Button></td></tr>

        </tbody>
      </table>
    </div>




  );
}



function SeverityCard({sev}) {
  return (
    <div className='card'>
      <Typography variant='h6' sx={{fontWeight:'bold'}}>Severity {sev}/10</Typography>

    </div>
  )

}



export default function Table() {
  const severities = Array.from({ length: 10 }, (_, i) => 10 - i);

  return (
    <div className='doc'>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        width: "95%",
      }}
    >
      {severities.map((sev) => (
        <SeverityCard key={sev} sev={sev} />
      ))}
    </div>
        </div>

  );
}