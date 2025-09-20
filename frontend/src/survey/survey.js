import Typography from '@mui/material/Typography';
import './getStarted.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';





const steps = [
    'Let\'s Get Started!',
    'What\'s Your Name?',
];

export default function GetStarted() {
    const [index, setIndex] = useState(0);
    const [startButton, setStartButton] = useState(false);
    const [show, setShow] = useState(true);
    const [name, setName] = useState('');


    const navigate = useNavigate();


    const nameEntered = () => {
        const checkinTime = new Date();
        localStorage.setItem('NAME', name);
        localStorage.setItem('CHECKIN', checkinTime);
        navigate('/symptoms');
    }

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
                <div style={{ marginTop: '3vh', display: 'flex', flexDirection: 'column' }}>
                    <Fade in={show} timeout={500}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e) => { setName(e.target.value) }} />
                    </Fade>

                    <Fade in={show} timeout={500}>
                        <Button variant="contained" sx={{ marginTop: '3vh' }} onClick={() => { nameEntered() }}>
                            Submit
                        </Button>
                    </Fade>
                </div>
            )}

        </div>
    );
}


