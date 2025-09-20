import Typography from '@mui/material/Typography';
import './getStarted.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';


const steps = [
    `Do You Have Any Other Symptoms?`,
];

function base64ToBlob(base64, mimeType = "image/jpeg") {
    const byteString = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

async function submit(){
    // const formData = new FormData();


    const fields = [
        'NAME',
        'SEX',
        'DOB',
        'ADDRESS',
        'BLOODTYPE',
        'PHONE',
        'EMAIL',
        'INSURANCE',
        'EMERGENCYPHONE',
        'AUDIOSYMPTOMS',
        'CHECKIN'
    ];

    fields.forEach(field => {
        const value = localStorage.getItem(field);
        if (value) {
            formData.append(field.toLowerCase(), value); // key in lowercase
        }
    });

    const capturedImageBase64 = localStorage.getItem("capturedImage");
    if (capturedImageBase64) {
        const blob = base64ToBlob(capturedImageBase64);
        formData.append("symptomImages", blob, "captured.jpg");
    }

    try {
        console.log(formData)
        const response = await fetch("http://127.0.0.1:5000/process", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Gemini response:", data);
        localStorage.clear();
    } catch (err) {
        console.error("Error submitting data:", err);
    }
}

export default function MoreSymptoms() {
    const [index, setIndex] = useState(0);
    const [startButton, setStartButton] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (index < steps.length - 1) {
            const timeout = setTimeout(() => {
                setShow(false);
            }, 1500);
            return () => clearTimeout(timeout);
        } else {
            setShow(true);
            setStartButton(true);
        }
    }, [index]);

    useEffect(() => {
        if (!show && index < steps.length - 1) {
            const timeout = setTimeout(() => {
                setIndex(index + 1);
                setShow(true);
            }, 1000);
            return () => clearTimeout(timeout);
        }
        if (index === steps.length - 1) {
            setStartButton(true);
        }
    }, [show, index]);

    return (
        <div className="getStarted">
            <Fade in={show} timeout={500}>
                <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }}  >
                    {steps[index]}
                </Typography>
            </Fade>
            {startButton && (
                <div style={{ marginTop: '3vh', display: 'flex', flexDirection: 'row', gap: '1vw' }}>
                    <Fade in={show} timeout={500}>
                        <a href="/audio" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ marginTop: '3vh' }}>
                                Yes
                            </Button>
                        </a>
                    </Fade>
                    
                    <Fade in={show} timeout={500}>
                        <a href="/thanks" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ marginTop: '3vh' }} 
                            onClick={async () => {
                                await submit();    
                                window.location.href = "/thanks"; 
                            }}>
                                No
                            </Button>
                        </a>
                    </Fade>
                </div>
            )}

        </div>
    );
}


