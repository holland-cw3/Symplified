import React, { useRef, useState, useCallback } from "react";
import ReactWebcam from "react-webcam";
import './getStarted.css';
import { useNavigate } from 'react-router-dom';


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
        localStorage.setItem("capturedImage", image);
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
                        mirrored={true}             // mirrors front camera
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="webcam-video"
                    />

                    <div className="camera-buttons">
                        <button className="capture-btn" onClick={capture}>
                            Capture
                        </button>
                        <button className="capture-btn" onClick={toggleCamera}>
                            Switch Camera
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <img src={image} alt="Captured" className="captured-image" />
                    <div className="flex flew-row">
                        <button className="capture-btn" onClick={() => {submitPic()}}>
                            Continue
                        </button>
                        <button className="capture-btn" onClick={() => setImage(null)}>
                            Retake
                        </button>
                    </div>

                </>
            )}
        </div>
    );
}
