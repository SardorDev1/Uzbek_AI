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

        if (
            detectedVoice === 'Assalomaleykum sizning ismingiz nima' ||
            detectedVoice === 'Assalom sizning ismingiz nima' ||
            detectedVoice === 'Assalom sizning ismingiz nima?' ||
            detectedVoice === 'Assalom aleykum sizning ismingiz nima?' ||
            detectedVoice === 'salom sening isming nima' ||
            detectedVoice === 'salom sening isming nima?' ||
            detectedVoice === 'Salom senzning ismingiz nima' ||
            detectedVoice === 'Salom senzning ismingiz nima?'
        ) {
            return;
        }

        if (
            detectedVoice === 'seni kim yaratdi?' ||
            detectedVoice === 'seni kim yasadi' ||
            detectedVoice === 'sizni kim yasadi' ||
            detectedVoice === 'sizni kim dasturladi' ||
            detectedVoice === 'seni kim dasturladi?' ||
            detectedVoice === 'sizni kim dasturladi?'
        ) {
            return;
        }

        const GptfetchData = async () => {

            const options = {
                method: 'POST',
                url: 'https://chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com/v1/chat/completions',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '79692c277fmshae8025707f0162cp130ff0jsn56637df21b6c',
                    'X-RapidAPI-Host': 'chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com'
                },
                data: {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: detectedVoice,
                        },
                    ],
                    temperature: 0.8,
                },
            };

            try {
                const response = await axios.request(options);
                const assistantVoice = response.data.choices?.[0].message.content;
                console.log(assistantVoice);
                setGptMessage(assistantVoice);
            } catch (error) {
                console.error(error);
            }
        };

        GptfetchData();
        setAssistantVoiceContent(null);
    }, [detectedVoice]);
    useEffect(() => {
        const voiceFetchData = async () => {
            if (GptMessage !== '' && detectedVoice !== '') {
                setIsLoading(true);
                const config = {
                    method: 'post',
                    url: 'https://studio.mohir.ai/api/v1/tts',
                    headers: {
                        Authorization: 'ce691ad1-7a84-4ba3-9981-9a99c77a7d08:feaf1612-2d4a-480a-aeb5-3b6593b3174a',
                        'Content-type': 'application/json',
                    },
                    data: {
                        text: GptMessage,
                        model: 'dilfuza',
                    },
                };
                try {
                    const response = await axios(config);
                    const voiceUrl = response.data.result.url;
                    setIsAssistantVoiceReady(false);
                    setAssistantVoiceContent(null);
                    setTimeout(() => {
                        setAssistantVoiceContent(null);
                        setAssistantVoiceContent(voiceUrl);
                        setIsLoading(false);
                        setIsAssistantVoiceReady(true);
                    }, 500);

                } catch (error) {
                    console.error(error);
                    setIsLoading(false);
                }
            }
        };

        voiceFetchData();
    }, [GptMessage, detectedVoice]);
    const isAudioPlaying = useRef(false);

    useEffect(() => {
        setTimeout(() => {
            if (isAssistantVoiceReady) {
                isAudioPlaying.current = true;
                audioRef.current.play();
            } else {
                if (isAudioPlaying.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    isAudioPlaying.current = false;
                }
            }
        }, 2000);
    }, [isAssistantVoiceReady]);


    useEffect(() => {
        if (detectedVoice === '') {
            return;
        }

        // Rest of the code...
        setDisplayText(detectedVoice);

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
                        <Box mt={5} ml={1} display={"flex"} alignItems={"center"}>
                            <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={<VerifiedUser className='AccountLogo' />} />

                            <Typography className='AccountInfo' ml={1} >
                                {localStorage.getItem('fullname')} {localStorage.getItem('name')}
                            </Typography>
                        </Box>
                        <Box mt={2} ml={2} display={"flex"} alignItems={"center"}>
                            <Typography className='AccountMode'>
                                Dark Mode
                                <Switch {...label} checked={dark} onChange={ToggleDarkMode} />

                            </Typography>
                        </Box>
                    </div>
                </div>


                <button onClick={toggleRecognition}>
                    {isRecognizing ? 'To\'xtatish' : 'Gapiring'}
                </button>

                <h1 className='DetectedTextData' >{displayText === '' ? '' : displayText}</h1>
                {isAssistantVoiceReady && (
                    <>
                        {isLoading ? (
                            <CircularProgress /> // Loaderni ko'rsatish
                        ) : (
                            <>

                                <audio ref={audioRef} id="audioPlayer" src={assistantVoiceContent} autoPlay />
                                <div className='WrapDetectedVoice' >
                                    <div className='BoxDetectedVoice'  >
                                        <p className='DetectedVoice' >{GptMessage}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

            </section >









        </>
    );
}

export default Dashboard;
