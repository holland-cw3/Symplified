import Typography from '@mui/material/Typography';
import './getStarted.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Fade, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PatientInfo() {
    const [showTitle, setShowTitle] = useState(false);
    const [showFields, setShowFields] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sex: '',
        dob: '',
        address: '',
        bloodType: '',
        phone: '',
        email: '',
        insurance: '',
        emergencyPhone: ''
    });

    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = () => {
        const checkinTime = new Date();
        Object.entries(formData).forEach(([key, value]) => {
            localStorage.setItem(key.toUpperCase(), value);
        });
        localStorage.setItem('CHECKIN', checkinTime);
        navigate('/symptoms'); // next screen
    }

    useEffect(() => {
        const titleTimeout = setTimeout(() => setShowTitle(true), 300);
        const fieldsTimeout = setTimeout(() => setShowFields(true), 1000);
        return () => {
            clearTimeout(titleTimeout);
            clearTimeout(fieldsTimeout);
        };
    }, []);

    const rowStyle = {
        display: 'flex',
        gap: '3vh',
        justifyContent: 'space-between',
        width: '100%'
    };

    return (
        <div
            className="getStarted"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3vh',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
                padding: '2vh 5vw',
                boxSizing: 'border-box',
                backgroundColor: 'rgb(132, 163, 220)', // full background color
            }}
        >
            {/* Title */}
            <Fade in={showTitle} timeout={500}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'center' }}>
                    Please Enter Your Information
                </Typography>
            </Fade>

            {/* Form Fields */}
            <Fade in={showFields} timeout={500}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4vh', width: '100%', maxWidth: '1000px' }}>
                    
                    {/* Row 1: Name */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            fullWidth
                            sx={{ maxWidth: '400px' }}
                        />
                    </div>

                    {/* Row 2: Sex, DOB, Address, Blood Type */}
                    <div style={rowStyle}>
                        <TextField
                            label="Sex"
                            variant="outlined"
                            value={formData.sex}
                            onChange={(e) => handleChange('sex', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Date of Birth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dob}
                            onChange={(e) => handleChange('dob', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Blood Type"
                            variant="outlined"
                            value={formData.bloodType}
                            onChange={(e) => handleChange('bloodType', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Insurance Provider"
                            variant="outlined"
                            value={formData.insurance}
                            onChange={(e) => handleChange('insurance', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                    </div>

                    {/* Row 3: Phone, Email, Insurance, Emergency Contact Phone */}
                    <div style={rowStyle}>
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Home Address"
                            variant="outlined"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Emergency Contact Phone"
                            variant="outlined"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2vh' }}>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Fade>
        </div>
    );
}