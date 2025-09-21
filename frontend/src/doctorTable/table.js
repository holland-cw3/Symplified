import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DescriptionIcon from "@mui/icons-material/Description"; // 📄 file icon
import Header from "./header";
import './doc.css'

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
          severity: patient.max_severity || 0,
          fullPatient: patient
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
      headerName: "",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <div
              style={{
               
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <IconButton
                color='primary'
                onClick={() => handleSeeFile(params.id)}
                sx={{ mr: 1 }}
              >
                <DescriptionIcon />
              </IconButton>
              <IconButton
                size="small"
                color='error'
                onClick={() => handleDelete(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="doc">
      <Header/>
      <div
        style={{
          height: "85vh",
          width: "95%",
          margin: "8vh auto 0 auto",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sortModel={[
            { field: "severity", sort: "desc" },
            { field: "waitTime", sort: "desc" },
          ]}
          sx={{
            borderRadius: "15px",
            boxShadow: "rgba(0, 0, 0, 0.4) 0px 3px 8px",
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: "white",
              color: "black",
              fontWeight: 900,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "black",
              fontWeight: 900,
              fontSize: "15px",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f7f7f7",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#ecedf2c2",
            },
            "& .MuiDataGrid-cell": {
              color: "#333",
            },
          }}
        />
      </div>
    </div>
  );
}
