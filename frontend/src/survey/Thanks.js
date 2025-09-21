import Typography from '@mui/material/Typography';
import './getStarted.css';
import { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from "../thnxLogo.png"

const steps = [
    "You're All Set!",
    'A Doctor Will Be With You Shortly.',
    'Thanks for Using',
];

export default function Thanks() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        let timeout;
        if (index < steps.length - 1) {
            timeout = setTimeout(() => {
                setShow(false);
            }, 2000);
        } else {
            setShow(true);
            timeout = setTimeout(() => {
                navigate('/');
            }, 10000);
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
            <Fade in={show} timeout={500} unmountOnExit>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '32px', textShadow: '3px 3px 2px rgba(13, 62, 100, 0.3)', textAlign: 'center' }}>
                        {steps[index]}
                    </Typography>

                    {/* Only render the logo element when on last step */}
                    {index === steps.length - 1 ? (
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ marginTop: '20px', height: '100px', objectFit: 'contain' }}
                        />
                    ) : null}
                </div>
            </Fade>
        </div>
    );
}


