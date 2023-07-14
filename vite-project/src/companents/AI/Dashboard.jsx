import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Avatar, Box, Card, CircularProgress, IconButton, Switch, Typography } from "@mui/material"
import { Close, VerifiedUser } from "@mui/icons-material"
import "../../App.css"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Dashboard() {
    const [detectedVoice, setDetectedVoice] = useState('');
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [assistantVoiceContent, setAssistantVoiceContent] = useState('');
    const [GptMessage, setGptMessage] = useState('');
    const [account, setAccount] = useState(false)
    const [displayText, setDisplayText] = useState('');
    const [isAssistantVoiceReady, setIsAssistantVoiceReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dark, setDark] = useState(false);
    const audioRef = useRef(null);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const startRecognition = () => {
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.lang = 'uz-UZ';
        setIsRecognizing(true);

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setDetectedVoice(transcript);
            setIsRecognizing(false);
        };

        recognition.start();
    };

    const stopRecognition = () => {
        setIsRecognizing(false);
        setDetectedVoice('');
    };

    const ToggleDarkMode = () => {
        setDark(!dark);
    };
    const TogglShowAccount = () => {
        setAccount(true);
    };
    const toggleRecognition = () => {
        if (isRecognizing) {
            stopRecognition();
        } else {
            startRecognition();
        }
    };

    useEffect(() => {
        if (detectedVoice === '') {
            return;
        }

        // Rest of the code...
        setDisplayText(detectedVoice);
        setTimeout(() => {
            setDisplayText('')
        }, 3000);
    }, [detectedVoice]);

    // Rest of the code...

    return (
        <>
            <section className={dark === true ? 'App dark' : 'App'} >

                <div className='Account'>
                    <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={<VerifiedUser className='AccountLogo' />} />
                    <div className='Account_Bar' style={{ width: '250px', height: '300px', borderRadius: "20px", position: 'absolute', backgroundColor: 'rgb(231, 231, 231)', display: account === false ? 'none' : 'block' }}>
                        <IconButton sx={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setAccount(false)}>
                            <Close className='AccountClose' />
                        </IconButton>
                        <Box mt={5} ml={1} display={"flex"}>
                            <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={<VerifiedUser className='AccountLogo' />} />

                            <Typography  ml={1} >
                                {localStorage.getItem('fullname')} {localStorage.getItem('name')}
                            </Typography>
                        </Box>
                        <Box mt={2} ml={2}>
 <Typography>
Dark Mode
 <Switch {...label} checked={dark} onChange={ToggleDarkMode} />

 </Typography>
                        </Box>
                    </div>
                </div>


                <button onClick={toggleRecognition}>
                    {isRecognizing ? 'To\'xtatish' : 'Gapiring'}
                </button>

                <h1>{displayText === '' ? '' : displayText}</h1>
                {isAssistantVoiceReady && (
                    <>
                        {isLoading ? (
                            <CircularProgress /> // Loaderni ko'rsatish
                        ) : (
                            <>

                                <audio ref={audioRef} id="audioPlayer" src={assistantVoiceContent} autoPlay />
                                {/* <p>{GptMessage}</p> */}
                            </>
                        )}
                    </>
                )}
                <div className='WrapDetectedVoice' >
                    <div className='BoxDetectedVoice'  >
                        <p className='DetectedVoice' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quam perspiciatis voluptatibus. Sit recusandae asperiores ipsam! Esse, totam voluptates. Fuga pariatur, officia doloremque consequuntur minus error, enim nostrum voluptatibus saepe vel dicta ad corporis quis eum labore praesentium ut eveniet assumenda alias nam dolore, architecto ratione? A distinctio voluptatem maiores repellendus aspernatur, mollitia consequatur dolor praesentium iusto, doloribus temporibus harum quo consectetur tenetur ex aliquid animi culpa dolore nihil cum rem consequuntur doloremque. Voluptate iste blanditiis aliquam rerum ipsa quibusdam?</p>
                    </div>
                </div>
            </section >









        </>
    );
}

export default Dashboard;
