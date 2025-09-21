import { useEffect, useState } from "react";
import Header from "./header";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

export default function PatientFile() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const storedPatient = sessionStorage.getItem("selectedPatient");
    if (storedPatient) {
      const parsed = JSON.parse(storedPatient);
      setPatient(parsed.fullPatient || parsed); // use fullPatient if exists
    }
  }, []);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <Header />

      <Typography variant="h4" gutterBottom sx={{ mt: 2, ml: 2 }}>
         Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography><strong>Age:</strong> {patient.age}</Typography>
              <Typography><strong>Blood Type:</strong> {patient.blood_type}</Typography>
              <Typography><strong>Email:</strong> {patient.email}</Typography>
              <Typography><strong>Phone:</strong> {patient.phone}</Typography>
              <Typography><strong>Emergency Phone:</strong> {patient.emergency_phone}</Typography>
              <Typography><strong>Insurance:</strong> {patient.insurance}</Typography>
              <Typography><strong>Address:</strong> {patient.address}</Typography>
              <Typography><strong>Check-in:</strong> {patient.checkin}</Typography>
              <Typography><strong>Sex:</strong> {patient.sex}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pictures */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploaded Images
              </Typography>
              {patient.image_ids && patient.image_ids.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {patient.image_ids.map((id, idx) => (
                    <img
                      key={idx}
                      src={`http://127.0.0.1:5000/images/${id}`}
                      alt={`Patient upload ${idx + 1}`}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography>No images uploaded</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Symptoms */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reported Symptoms
              </Typography>
              <Typography>
                {patient.gemini_output || patient.audio_symptoms || "No symptoms recorded"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "#eaf2fb" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography>
                {patient.gemini_output || patient.audio_symptoms || "No symptoms recorded"}

              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
