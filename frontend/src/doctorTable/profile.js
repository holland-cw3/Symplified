import { useEffect, useState } from "react";
import Header from "./header";
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableRow } from "@mui/material";

async function getImage(imageId) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/image/${imageId}`);
    if (!response.ok) throw new Error("Image fetch failed");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Couldn't fetch image", e);
    return null;
  }
}

export default function PatientFile() {
  const [patient, setPatient] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const storedPatient = sessionStorage.getItem("selectedPatient");
    if (storedPatient) {
      const parsed = JSON.parse(storedPatient);
      const fullPatient = parsed.fullPatient || parsed;
      setPatient(fullPatient);

      // fetch all images
      if (fullPatient.image_ids && fullPatient.image_ids.length > 0) {
        Promise.all(fullPatient.image_ids.map(id => getImage(id)))
          .then(urls => setImageUrls(urls.filter(Boolean))); // remove failed fetches
      }
    }
  }, []);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Typography variant="h4" gutterBottom sx={{ mt: '14vh', ml: 2 }}>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
        <div className="flex flex-col gap-6" style={{ minWidth: 300 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Info</Typography>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell><strong>Name</strong></TableCell><TableCell>{patient.name}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Age</strong></TableCell><TableCell>{patient.age}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Sex</strong></TableCell><TableCell>{patient.sex}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Blood Type</strong></TableCell><TableCell>{patient.blood_type}</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Contact Info</Typography>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell><strong>Email</strong></TableCell><TableCell>{patient.email}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Phone</strong></TableCell><TableCell>{patient.phone}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Emergency Phone</strong></TableCell><TableCell>{patient.emergency_phone}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Address</strong></TableCell><TableCell>{patient.address}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Insurance</strong></TableCell><TableCell>{patient.insurance}</TableCell></TableRow>
                  <TableRow><TableCell><strong>Check-in</strong></TableCell><TableCell>{patient.checkin}</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div style={{ minWidth: 300 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Uploaded Images</Typography>
              {imageUrls.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
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
        </div>

        <div style={{ minWidth: 300 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Reported Symptoms</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {patient.gemini_output || patient.audio_symptoms || "No symptoms recorded"}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div style={{ minWidth: 300 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {patient.gemini_output || patient.audio_symptoms || "No summary recorded"}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Box>


    </div>
  );
}
