import React, { useRef, useState, useCallback } from "react";
import ReactWebcam from "react-webcam";
import './getStarted.css';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

function submit(){
    const obj = {
        name: localStorage.getItem('NAME'), 

    }
    localStorage.getItem('Symtom')
}


export default function Camera() {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
    const [facingMode, setFacingMode] = useState("user");
    
    const navigate = useNavigate();

    const videoConstraints = {
        width: 480,
        height: 640,
        facingMode: facingMode,
    };

    const submitPic = () => {
        localStorage.setItem("IMAGESYMPTOMS", image);
        navigate('/moreSymptoms');

    }

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            setImage(screenshot);
        }
    }, [webcamRef]);

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="camera-container">
            {!image ? (
                <>
                    <ReactWebcam
                        audio={false}
                        mirrored={true}            
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="webcam-video"
                    />

                    <div className="camera-buttons">
                        <Button variant='contained' className="capture-btn" onClick={capture}>
                            Capture
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <img src={image} alt="Captured" className="captured-image" />
                    <div className="flex flew-row gap-4 mt-2">
                        <Button variant='contained' className="capture-btn" onClick={() => {submitPic()}}>
                            Continue
                        </Button>
                        <Button variant='contained' className="capture-btn" onClick={() => setImage(null)}>
                            Retake
                        </Button>
                    </div>

                </>
            )}
        </div>
    );
}
