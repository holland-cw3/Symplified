import { useEffect, useState } from "react";

export default function PatientFile() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const storedPatient = sessionStorage.getItem("selectedPatient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, []);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h2>{patient.name}'s File</h2>
      <p>Age: {patient.age}</p>
      <p>Blood Type: {patient.bloodType}</p>
      <p>Wait Time: {patient.waitTime} min</p>
      <p>Severity: {patient.severity}</p>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
      <p>Insurance: {patient.insurance}</p>
      <p>Address: {patient.address}</p>
      <p>Check-in: {patient.checkin}</p>
      <p>Symptoms: {patient.gemini_output || patient.audio_symptoms}</p>
    </div>
  );
}
