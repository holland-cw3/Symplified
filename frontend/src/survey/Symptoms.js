import Typography from '@mui/material/Typography';
import './getStarted.css';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Symptoms() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);
    const [steps, setSteps] = useState([
        'Hi!',
        'What Brings You In Today?',
    ]);

    const navigate = useNavigate()


    useEffect(() => {
        const name = localStorage.getItem('NAME') || 'Guest';
        setSteps([
            `Hi ${name}!`,
            'What Brings You In Today?',
        ]);
    }, []);

    useEffect(() => {
        if (index < steps.length) {
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
        if (index === steps.length - 1) {
            const redirectTimeout = setTimeout(() => {
                navigate('/camera');
            }, 2000);

            return () => clearTimeout(redirectTimeout);
        }
    }, [show, index]);

    return (
        <div className="getStarted">
            <Fade in={show} timeout={500}>
                <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }} >
                    {steps[index]}
                </Typography>
            </Fade>
        </div>
    );
}
