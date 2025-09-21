import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

async function getData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/entries", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
}

export default function PatientDataTable() {
  const { logout, user } = useAuth0();
  const [data, setData] = useState([]);

  const handleSeeFile = (patientId) => {
    const file = data.find((e) => e.id === patientId);
    console.log(file);
    sessionStorage.setItem("selectedPatient", JSON.stringify(file));
    window.open("/patientfile", "_blank");
  };

  const handleDelete = async (patientId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/entries/${patientId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        // Remove deleted row from state
        setData((prev) => prev.filter((p) => p.id !== patientId));
      } else {
        console.error("Failed to delete:", result.message);
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();

      const mappedData = result.map((patient, index) => {
        const dob = new Date(patient.dob);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        let waitTime = 0;
        if (patient.checkin) {
          const checkinTime = new Date(patient.checkin);
          const diffMs = Date.now() - checkinTime.getTime();
          waitTime = Math.floor(diffMs / 60000);
        }

        return {
          id: patient._id || index,
          name: patient.name,
          age: age,
          bloodType: patient.blood_type,
          waitTime: waitTime,
          severity: patient.severity || 0,
        };
      });

      setData(mappedData);
    };

    fetchData();
  }, []);

  const columns = [
    { field: "name", headerName: "Patient Name", flex: 1 },
    { field: "age", headerName: "Age", type: "number", flex: 0.5 },
    { field: "bloodType", headerName: "Blood Type", flex: 0.7 },
    { field: "waitTime", headerName: "Wait Time (min)", type: "number", flex: 1 },
    { field: "severity", headerName: "Severity Score", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1 }}
              onClick={() => handleSeeFile(params.id)}
            >
              See File
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(params.id)}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="doc">
      <div
        style={{
          backgroundColor: "white",
          width: "95%",
          margin: "2.25vh auto 0 auto",
          borderRadius: "15px",
          padding: "1vw",
          boxShadow: "rgba(0, 0, 0, 0.4) 0px 3px 8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          <strong>Hello {user?.name}!</strong>
        </Typography>
        <Typography variant="h6">
          <strong>Symplified</strong>
        </Typography>
        <div>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              logout({ returnTo: window.location.origin + "/doctorlogin" })
            }
          >
            Log Out
          </Button>
        </div>
      </div>
      <div
        style={{
          height: "82vh",
          width: "95%",
          margin: "3vh auto 0 auto",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sortModel={[
            { field: "severity", sort: "desc" },
            { field: "waitTime", sort: "desc" },
          ]}
          sx={{
            borderRadius: "15px",
            boxShadow: "rgba(0, 0, 0, 0.4) 0px 3px 8px;",
          }}
        />
      </div>
    </div>
  );
}
