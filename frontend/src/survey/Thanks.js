import Typography from '@mui/material/Typography';
import './getStarted.css';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps = [
    'Thank You!',
    'A Doctor Will Be With You Shortly.',
];

export default function Thanks() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let timeout;
        if (index < steps.length - 1) {
            timeout = setTimeout(() => {
                setShow(false);
            }, 1500);
        } else {
            setShow(true);
            timeout = setTimeout(() => {
                navigate('/');
            }, 15000);
        }

        return () => clearTimeout(timeout);
    }, [index, navigate]);

    useEffect(() => {
        if (!show && index < steps.length - 1) {
            const timeout = setTimeout(() => {
                setIndex(index + 1);
                setShow(true);
            }, 1000);
            return () => clearTimeout(timeout);
        }

    }, [show, index]);

    return (
        <div className="getStarted">
            <Fade in={show} timeout={500}>
                <Typography sx={{ 'fontWeight': 'bold', 'fontSize': '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)' }}  >
                    {steps[index]}
                </Typography>
            </Fade>
        </div>
    );
}


