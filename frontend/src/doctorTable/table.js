import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";

const patients = [
  { id: 1, name: "Caleb Holland", age: 35, bloodType: "O+", waitTime: 80, severity: 7 },
  { id: 2, name: "Alice Smith", age: 28, bloodType: "A-", waitTime: 30, severity: 3 },
  { id: 3, name: "John Doe", age: 42, bloodType: "B+", waitTime: 120, severity: 9 },
  { id: 4, name: "Jane Miller", age: 50, bloodType: "AB-", waitTime: 50, severity: 5 },
];

export default function PatientDataTable() {
  const columns = [
    { field: "name", headerName: "Patient Name", flex: 1 },
    { field: "age", headerName: "Age", type: "number", flex: 0.5 },
    { field: "bloodType", headerName: "Blood Type", flex: 0.7 },
    {
      field: "waitTime",
      headerName: "Wait Time (min)",
      type: "number",
      flex: 1,
    },
    {
      field: "severity",
      headerName: "Severity Score",
      type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: () => (
        <>
          <Button variant="contained" size="small" sx={{ mr: 1 }}>
            See File
          </Button>
          <Button variant="contained" color="error" size="small">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="doc">
      <div style={{backgroundColor:'white', width: "95%",  margin: '2.25vh auto 0 auto', borderRadius: '15px', padding:'1vw',  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} >
        <Typography variant="h6"><strong>Hello Doctor!</strong></Typography>
        <Typography variant="h6"><strong>Symplified</strong></Typography>
        <div>
          <Button variant="contained" color="success">Logout</Button>
        </div>
      </div>
      <div style={{ height: '82vh', width: "95%",  margin: '3vh auto 0 auto' }}>
        <DataGrid
          rows={patients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sortModel={[
            { field: "severity", sort: "desc" },
            { field: "waitTime", sort: "desc" },
          ]}
          sx={{borderRadius:'15px',  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 3px 8px;'}}
        />
      </div>
    </div>
  );
}
