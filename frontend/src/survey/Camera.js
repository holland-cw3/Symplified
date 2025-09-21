import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Fade, TextField } from "@mui/material";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import './getStarted.css';

export default function AudioCameraCombined() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const videoConstraints = {
    width: 480,
    height: 640,
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImage(screenshot);
    }
  }, []);


  const submitPic = () => {
    localStorage.setItem("IMAGESYMPTOMS", image);
    navigate("/moreSymptoms");
  };

  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [steps] = useState(["What Symptoms Are You Experiencing?"]);
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [editableTranscript, setEditableTranscript] = useState("");

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    if (index < steps.length - 1) {
      const timeout = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timeout);
    } else {
      setShow(true);
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

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const submitAudio = () => {
    localStorage.setItem("AUDIOSYMPTOMS", JSON.stringify(editableTranscript));
    navigate("/moreSymptoms");
  };

  return (
    <div
      className="combined-container"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "4vw",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2vh 2vw",
      }}
    >
      <div style={{ flex: 1 }}>
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

        <TextField
          multiline
          minRows={6}
          maxRows={10}
          value={editableTranscript}
          onChange={(e) => setEditableTranscript(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "1rem", backgroundColor:'white', borderRadius:'15px' }}
        />

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            variant="contained"
            onClick={() =>
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-US",
                interimResults: true,
              })
            }
          >
            Record
          </Button>
          <Button variant="contained" onClick={SpeechRecognition.stopListening}>
            Stop
          </Button>
          <Button variant="contained" color="success" onClick={submitAudio}>
            Submit
          </Button>
        </div>

        <p className="text-red-600 font-bold">{listening ? "Recording..." : ""}</p>
      </div>

      {/* Camera Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {!image ? (
          <>

            <ReactWebcam
              audio={false}
              mirrored={true}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
            />

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <Button variant="contained" onClick={capture}>
                Capture
              </Button>
             
            </div>
          </>
        ) : (
          <>
            <img
              src={image}
              alt="Captured"
              style={{ borderRadius: "10px", maxWidth: "100%", marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button variant="contained" color="success" onClick={submitPic}>
                Continue
              </Button>
              <Button variant="outlined" onClick={() => setImage(null)}>
                Retake
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
