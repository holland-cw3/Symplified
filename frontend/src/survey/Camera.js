import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Fade, TextField } from "@mui/material";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import './getStarted.css';

export function AudioRecorder({ editableTranscript, onTranscriptChange, onSubmit }) {
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <TextField
        multiline
        minRows={6}
        maxRows={10}
        value={editableTranscript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: "1rem", backgroundColor:'white', borderRadius:'15px' }}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Button
          variant="contained"
          onClick={() =>
            SpeechRecognition.startListening({ continuous: true, language: "en-US", interimResults: true })
          }
        >
          Record
        </Button>
        <Button variant="contained" onClick={SpeechRecognition.stopListening}>Stop</Button>
        <Button variant="contained" color="success" onClick={onSubmit}>Submit</Button>
      </div>

      <p className="text-red-600 font-bold">{listening ? "Recording..." : ""}</p>
    </div>
  );
}

export function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const videoConstraints = { width: 640, height: 500 };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImage(screenshot);
      onCapture(screenshot);
    }
  }, [onCapture]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!image ? (
        <>
          <ReactWebcam
            audio={false}
            mirrored
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
          />
          <Button variant="contained" onClick={capture} sx={{ mt: 2 }}>
            Capture
          </Button>
        </>
      ) : (
        <>
          <img src={image} alt="Captured" style={{ borderRadius: "10px", maxWidth: "100%" }} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setImage(null)}
            sx={{ mt: 2 }}
          >
            Retake
          </Button>
        </>
      )}
    </div>
  );
}

export default function AudioCameraCombined() {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);

  const [steps] = useState(["What Symptoms Are You Experiencing?"]);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [editableTranscript, setEditableTranscript] = useState("");

  // Fade text logic
  useEffect(() => {
    if (index < steps.length - 1) {
      const timeout = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [index, steps.length]);

  useEffect(() => {
    if (!show && index < steps.length - 1) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
        setShow(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [show, index, steps.length]);

  const handleImageCapture = (image) => {
    setCapturedImage(image);
  };

  const handleSubmit = () => {
    if (!capturedImage || !editableTranscript.trim()) {
      alert("Please provide both audio and image before submitting.");
      return;
    }
    localStorage.setItem("IMAGESYMPTOMS", capturedImage);
    localStorage.setItem("AUDIOSYMPTOMS", editableTranscript);
    navigate("/moreSymptoms");
  };

  return (
    <div className='getStarted'>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "4vw",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2vh 2vw",
      }}
    >
      <Fade in={show} timeout={500}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "28px",
              textShadow: "2px 2px 2px rgba(0,0,0,0.2)",
              marginBottom: "1rem",
              color: 'white'
            }}
          >
            {steps[index]}
          </Typography>
        </Fade>
      <div style={{ flex: 1 }}>
        <AudioRecorder
          editableTranscript={editableTranscript}
          onTranscriptChange={setEditableTranscript}
          onSubmit={handleSubmit} 
        />
      </div>

      <div style={{ flex: 1 }}>
        <CameraCapture onCapture={handleImageCapture} />
      </div>
    </div>
    </div>
  );
}
