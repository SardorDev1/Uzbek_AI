import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Avatar, Box, Card, CircularProgress, IconButton, Switch, Typography } from "@mui/material"
import { Close, VerifiedUser, KeyboardVoice } from "@mui/icons-material"
import { Grow, Slide, Fade, Snackbar, Button } from '@mui/material';
import "../../App.css"
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../config/firebase';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';




function GrowTransition(props) {
    return <Grow {...props} />;
}



function Dashboard() {


    const [detectedVoice, setDetectedVoice] = useState('');
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [assistantVoiceContent, setAssistantVoiceContent] = useState('');
    const [GptMessage, setGptMessage] = useState('');
    const [account, setAccount] = useState(false)
    const [displayText, setDisplayText] = useState('');
    const [isAssistantVoiceReady, setIsAssistantVoiceReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [MessageFromIF, setMessageFromIF] = useState('')
    const [VoiceTrue, setVoiceTrue] = useState(false)
    const [GptMessageiSDisplay, setGptMessageiSDisplay] = useState('')
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

    // const symbols = [];
    // "’", "‵", "‛", "”", "ʼ"
    function replaceSymbols(text) {
        return text
            .replace(/’/g, "'")
            .replace(/‵/g, "'")
            .replace(/‛/g, "'")
            .replace(/”/g, "'")
            .replace(/ʼ/g, "'");
    }


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
        } else if (
            detectedVoice === 'Assalomaleykum' ||
            detectedVoice === 'Assalom' ||
            detectedVoice === 'Assalomalekum' ||
            detectedVoice === 'assalom aleykum' ||
            detectedVoice === 'assalom alekum' ||
            detectedVoice === 'asalom' ||
            detectedVoice === 'assalom' ||
            detectedVoice === 'salomat'
        ) {
            setMessageFromIF(`Assalomu Aleykum ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')}! sizga qanday yordam berishim mumkin`)
            setVoiceTrue(true)
        } else if (
            detectedVoice === 'rahmat senga' ||
            detectedVoice === 'rahmat' ||
            detectedVoice === 'katta raxmat senga' ||
            detectedVoice === 'katta rahmat senga' ||
            detectedVoice === 'tashakur senga' ||
            detectedVoice === 'tashakur' ||
            detectedVoice === 'katta rahmat' ||
            detectedVoice === 'katta rahmat sizga' ||
            detectedVoice === 'rahmat sizga' ||
            detectedVoice === 'rahmatlar bolsin' ||
            detectedVoice === 'katta raxmat sanga' ||
            detectedVoice === 'tashakur sizga' ||
            detectedVoice === 'rahmat sog bol' ||
            detectedVoice === 'tashakur sog bol'
        ) {
            const reqRandom = ["Sog' bo'ling, meni ishlatganingizdan hursandman", `Sizga ham rahmat ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')} aka!, sizga yordam berganimdan hursandman`, "Bugungi kun uchun sizga rahmat!", "Salomat Bo'ling, sizga ham katta rahmat meni ishlatganingiz uchun"];
            const randomIndex = Math.floor(Math.random() * reqRandom.length);
            setGptMessage(reqRandom[randomIndex]);
            setMessageFromIF(reqRandom[randomIndex])
            setVoiceTrue(true)
        }
        else if (
            detectedVoice === 'valekum assalom' ||
            detectedVoice === 'valekum' ||
            detectedVoice === 'vaaleykum assalom' ||
            detectedVoice === 'valekum asalom' ||
            detectedVoice === 'vaalaykum asalom' ||
            detectedVoice === 'volikum assalom' ||
            detectedVoice === 'voaleykum assalom' ||
            detectedVoice === 'volekum asalom' ||
            detectedVoice === 'voaleykum assalom' ||
            detectedVoice === 'valikum assalom' ||
            detectedVoice === 'volikum asalom' ||
            detectedVoice === 'va aleykum assalom'

        ) {
            const reqRandom = ["Menga qanday savolingiz bor?", `menga qanday savolingiz bor? ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')}`, "Savolingiz bormi?", "Savollar bo'sa bemalol"];
            const randomIndex = Math.floor(Math.random() * reqRandom.length);
            setGptMessage(reqRandom[randomIndex]);
            setMessageFromIF(reqRandom[randomIndex])
            setVoiceTrue(true)
        }
        const GptfetchData = async () => {

            const options = {
                method: 'POST',
                url: 'https://chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com/v1/chat/completions',
                headers: {
                  'content-type': 'application/json',
                  'X-RapidAPI-Key': '0a0c0a24c2msh5bec3f133a111f2p1876cajsnd92a500a2381',
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

            setIsLoading(true)

            try {
                const response = await axios.request(options);
                const assistantVoice = response.data.choices?.[0].message.content;
                console.log(assistantVoice);
                setIsLoading(false)
                setGptMessage(assistantVoice);

            } catch (error) {
                console.error(error);
                const reqRandom = ["Obooo yana sizmi!", `Iltimos ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')} aka! kiyinroq qayta urinib ko'ring!`, "Bugungi kunda menga beriloyotgan so'rovlar kopayib ketti kiyinroq urinib koring"];
                const randomIndex = Math.floor(Math.random() * reqRandom.length);
                setGptMessage(reqRandom[randomIndex]);
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
                        text: VoiceTrue === true ? replaceSymbols(MessageFromIF) : replaceSymbols(GptMessage),
                        model: 'davron',
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
        setGptMessageiSDisplay(VoiceTrue === true ? MessageFromIF : GptMessage)
        function handleAudioEnd() {
            setDetectedVoice('')

            setVoiceTrue(false)
            setTimeout(() => {
                setGptMessage('')
            }, 500);

        }

        if (audioRef.current) {
            audioRef.current.addEventListener("ended", handleAudioEnd);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("ended", handleAudioEnd);
            }
        };


    }, [isAssistantVoiceReady]);



    useEffect(() => {
        if (detectedVoice === '') {
            return;
        }

        // Rest of the code...
        setDisplayText(detectedVoice);
        setTimeout(() => {
            setDisplayText('')
        }, 4000)
    }, [detectedVoice]);

    // Rest of the code..
    const [dots, setDots] = useState("...")
    const [user, setUser] = useState(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                console.log(user);
            } else {
                navigator("/login")

            }
        });
        if (isLoading === true) {
            const interval = setInterval(() => {
                setDots(prevDots => {
                    if (prevDots === '...') {
                        return '..';
                    } else if (prevDots === '..') {
                        return '.';
                    } else {
                        return '...';
                    }
                });
            }, 150);
        } else {
            return;
        }

        return () => clearInterval(interval);

    }, []);

    const [state, setState] = useState({
        open: true,
        Transition: Fade,
    });


    const handleClick = (Transition) => () => {
        setState({
            open: isLoading === true ? true : false,
            Transition,
        });
    };


    const SignOutHandler = () => {
        signOut(auth).then(() => {
            localStorage.clear()
        }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <>
            <section className={dark === true ? 'App dark' : 'App'} >

                <div className='Account'>
                    <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={(<VerifiedUser className='AccountLogo' />)} />
                    <div className='Account_Bar' style={{ width: '250px', height: '300px', borderRadius: "20px", position: 'absolute', backgroundColor: 'rgb(231, 231, 231)', display: account === false ? 'none' : 'block' }}>
                        <IconButton sx={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setAccount(false)}>
                            <Close className='AccountClose' />
                        </IconButton>
                        <Box mt={5} ml={1} display={"flex"} alignItems={"center"}>
                            <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={<VerifiedUser className='AccountLogo' />} />

                            <Typography className='AccountInfo' ml={1} >
                                {user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName}
                            </Typography>
                        </Box>
                        <Box mt={2} ml={2} display={"flex"} alignItems={"center"}>
                            <Typography className='AccountMode'>
                                Dark Mode
                                <Switch {...label} checked={dark} onChange={ToggleDarkMode} />
                            </Typography>
                        </Box>
                        <Box>
                            <Button onClick={SignOutHandler} variant="outlined" className='AccountOutButton' color="error">
                                Akkauntdan Chiqish
                            </Button>
                        </Box>
                    </div>
                </div>


                <button id='MicrophoneButton' className={isRecognizing ? 'MicrophoneButtonOn' : 'MicrophoneButtonOff'} onClick={toggleRecognition}>

                    {isRecognizing ? <KeyboardVoice className='MicrophoneIcon' /> : <KeyboardVoice className='MicrophoneIcon ' />}
                </button>
                <h1 className='DetectedTextData' >{displayText === '' ? '' : displayText}</h1>


                {isAssistantVoiceReady && (
                    <>
                        {isLoading === true ? (
                            <Box display={"flex"} alignItems={"center"}  >

                                <Snackbar
                                    open={state.open}
                                    TransitionComponent={state.Transition}
                                    sx={{ borderRadius: "20px" }}
                                    message={<div style={{ display: 'flex', alignItems: 'center' }}><CircularProgress />  <p style={{ marginLeft: "10px" }} >O'ylamoqda {dots}</p></div>}
                                    key={state.Transition.name}

                                />
                            </Box>
                        ) : (
                            <>

                                <audio ref={audioRef} id="audioPlayer" src={assistantVoiceContent} autoPlay />
                                {GptMessageiSDisplay === '' ? (<></>) : (
                                    <>
                                        <div className='WrapDetectedVoice' >

                                            <div className='BoxDetectedVoice'  >
                                                <div onClick={() => setGptMessageiSDisplay('')} >
                                                    <Close className='CloseDetectedVoice' />

                                                </div>
                                                <p className='DetectedVoice' >{GptMessageiSDisplay}</p>
                                            </div>
                                        </div>
                                    </>
                                )
                                }
                            </>
                        )}
                    </>
                )}



            </section >









        </>
    );
}

export default Dashboard;
