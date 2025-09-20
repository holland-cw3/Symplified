import Typography from '@mui/material/Typography';
import './getStarted.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';


const steps = [
    `Hi ${localStorage.getItem('NAME')}!`,
    'What Brings You In Today?',
];

export default function Symptoms1() {
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
                <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '28px' }} >
                    {steps[index]}
                </Typography>
            </Fade>

            {startButton && (
                <div style={{ marginTop: '3vh', display: 'flex', flexDirection: 'column' }}>
                    <Fade in={show} timeout={500}>
                        <a href="/audio" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ marginTop: '3vh' }}>
                                Record Audio
                            </Button>
                        </a>
                    </Fade>
                    
                    <Fade in={show} timeout={500}>
                        <a href="/camera" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" sx={{ marginTop: '3vh' }}>
                                Take A Photo
                            </Button>
                        </a>
                    </Fade>
                </div>
            )}

        </div>
    );
}


