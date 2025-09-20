import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './getStarted.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Fade, Typography } from '@mui/material';




export default function Dictaphone() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const [steps, setSteps] = useState([
        'What Symptoms Are You Experiencing?',
    ]);

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (index < steps.length - 1) {
            const timeout = setTimeout(() => {
                setShow(false);
            }, 1500);
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


    const submit = () => {
        localStorage.setItem('AUDIOSYMPTOMS', JSON.stringify(transcript))
        navigate('/moreSymptoms');
    }

    return (
        <div className='getStarted'>
             <Fade in={show} timeout={500}>
                <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }}  >
                    {steps[index]}
                </Typography>
            </Fade>

            <p className='text-red-600 font-bold'>{listening ? 'Recording...' : ''}</p>

            <p className='bg-white' style={{ minHeight: '100px', width: '30vw', marginTop: '3vh', marginBottom: '3vh', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px', color: 'black' }}>
                {transcript}
            </p>
            <div className='flex flex-row gap-2'>
                <Button variant='contained' onClick={() =>
                    SpeechRecognition.startListening({
                        continuous: true,
                        language: 'en-US',
                        interimResults: true
                    })
                }>Record</Button>
                <Button variant='contained' onClick={SpeechRecognition.stopListening}>Stop</Button>
                <Button variant='contained' onClick={() => { submit() }}>Submit</Button>

            </div>



        </div>
    );
};
