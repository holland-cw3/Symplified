import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './getStarted.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function  Dictaphone () {
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
        localStorage.setItem('symptoms', JSON.stringify(transcript))
        navigate('/moreSymptoms');
    }

    return (
        <div className='getStarted'>
            <p>Microphone: {listening ? 'Recording...' : 'off'}</p>
            <div className='flex flex-row'>
                <Button variant='contained' onClick={() =>
                    SpeechRecognition.startListening({
                        continuous: true,
                        language: 'en-US',
                        interimResults: true
                    })
                } sx={{ marginRight: '2px' }}>Start</Button>
                <Button variant='contained' onClick={SpeechRecognition.stopListening}>Stop</Button>
            </div>

            <p>{transcript}</p>
            <Button variant='contained' onClick={() => { submit() }}>Submit</Button>

        </div>
    );
};
