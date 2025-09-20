import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './getStarted.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function Dictaphone() {
    const navigate = useNavigate();

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    const submit = () => {
        localStorage.setItem('AUDIOSYMPTOMS', JSON.stringify(transcript))
        navigate('/moreSymptoms');
    }

    return (
        <div className='getStarted'>
            <p className='bg-white' style={{ minHeight: '100px', width: '30vw', marginTop: '3vh',  marginBottom: '3vh', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px', color: 'black'}}>
                {transcript}
            </p>
            <p>Microphone: {listening ? 'Recording...' : 'off'}</p>
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
