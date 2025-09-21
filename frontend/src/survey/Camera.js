import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Fade, TextField } from "@mui/material";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import './getStarted.css';

export default function AudioCameraCombined() {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [editableTranscript, setEditableTranscript] = useState("");
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  const steps = ["What Symptoms Are You Experiencing?"];

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

  const webcamRef = useRef(null);
  const videoConstraints = { width: 640, height: 360 };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setCapturedImage(screenshot);
    }
  }, []);

  const handleSubmit = () => {
    if (!capturedImage || !editableTranscript.trim()) {
      alert("Please provide both audio and image before submitting.");
      return;
    }

    let existing = localStorage.getItem("IMAGESYMPTOMS");

    if (existing === null) {
      localStorage.setItem("IMAGESYMPTOMS", JSON.stringify([capturedImage]));
    } else {
      let curr = JSON.parse(existing); // now curr is always an array
      curr.push(capturedImage);
      localStorage.setItem("IMAGESYMPTOMS", JSON.stringify(curr));
    }

    localStorage.setItem("AUDIOSYMPTOMS", editableTranscript);
    navigate("/moreSymptoms");
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening) setEditableTranscript(transcript);
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser doesn't support speech recognition.</p>;
  }

  return (
    <div className='getStarted' style={{ padding: "2vh 2vw" }} sx={{ width: '100%' }}>
      <Fade in={show} timeout={500}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "28px",
            textShadow: "2px 2px 2px rgba(0,0,0,0.2)",
            marginBottom: "1rem",
            color: 'white',
          }}
        >
          {steps[index]}
        </Typography>
      </Fade>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2vw",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2vh 2vw",
          backgroundColor: "#f5f4f4",
          borderRadius: "15px",
          boxShadow: "rgba(0, 0, 0, 0.4) 0px 3px 8px",


        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TextField
            multiline
            minRows={14}
            maxRows={14}
            value={editableTranscript}
            onChange={(e) => setEditableTranscript(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "1rem", backgroundColor: 'white', borderRadius: '15px' }}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!capturedImage ? (
            <ReactWebcam
              audio={false}
              mirrored
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                marginBottom: "1rem",
                backgroundColor: 'black',
                width: videoConstraints.width,
                height: videoConstraints.height
              }}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                borderRadius: "10px",
                width: videoConstraints.width,
                height: videoConstraints.height,
                objectFit: "cover",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                marginBottom: "1rem"
              }}
            />
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
        <Button
          variant="contained"
          onClick={() => {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: "en-US" });
          }}
        >
          Record
        </Button>
        <Button variant="contained" onClick={SpeechRecognition.stopListening}>
          Stop
        </Button>

        {!capturedImage && (
          <Button variant="contained" onClick={capturePhoto}>
            Capture Photo
          </Button>
        )}

        {capturedImage && (
          <Button variant="outlined" color="secondary" onClick={() => setCapturedImage(null)}>
            Retake Photo
          </Button>
        )}
      </div>

      <p className="text-red-600 font-bold" style={{ textAlign: "center", marginTop: "1rem" }}>
        {listening ? "Recording..." : ""}
      </p>

      <hr style={{ margin: "2rem 0", borderColor: "#ccc" }} />

      <div style={{ textAlign: "center" }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
