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
        const today = new Date();

        const age = today.getFullYear() - dob.getFullYear();

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
  {
    field: "severity",
    headerName: "Severity Score",
    type: "number",
    flex: 1,
    renderCell: (params) => {
      const value = params.value;

      // Clamp value between 1 and 10
      const severity = Math.max(1, Math.min(10, value));

      // Calculate gradient color from green (#4CAF50) to red (#F44336)
      // We'll interpolate RGB values
      const green = { r: 76, g: 175, b: 80 };   // #4CAF50
      const red = { r: 244, g: 67, b: 54 };     // #F44336

      const t = (severity - 1) / 9; // normalize 1-10 to 0-1

      const r = Math.round(green.r + (red.r - green.r) * t);
      const g = Math.round(green.g + (red.g - green.g) * t);
      const b = Math.round(green.b + (red.b - green.b) * t);

      const color = `rgb(${r}, ${g}, ${b})`;

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", // right-aligned
            alignItems: "center",       // vertically centered
            height: "100%",
            paddingRight: 8,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: color,
              color: "white",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {value}
          </div>
        </div>
      );
    },
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    filterable: false,
    flex: 1,
    renderCell: (params) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <IconButton
            color="primary"
            onClick={() => handleSeeFile(params.id)}
            sx={{ mr: 1 }}
          >
            <DescriptionIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      );
    },
  },
];

  return (
    <div className="doc">
      <Header />
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

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "white",
              color: "black",
              fontWeight: 900,
              fontSize: "15px",
              transition: "background-color 0.2s ease", // smooth grey hover
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 900,   // locked in → no shifting
              fontSize: "15px",
              color: "black",
            },

            // ✅ subtle grey hover without moving text
            "& .MuiDataGrid-columnHeader:hover": {
              backgroundColor: "#f5f5f5",
            },

            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
          }}
        />
      </div>
    </div>
  );
}
