import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Avatar, Box, Card, CircularProgress, FormControl, LinearProgress, IconButton, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material"
import { Close, VerifiedUser, KeyboardVoice, CheckCircle } from "@mui/icons-material"
import { Grow, Slide, Fade, Snackbar, Button } from '@mui/material';
import "../../App.css"
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../config/firebase';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import { franc } from 'franc';
import '@fontsource/roboto/700.css';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
function GrowTransition(props) {
    return <Grow {...props} />;
}



function Dashboard() {

    const [MusicUrls, setMusicUrls] = useState([]);
    const MusicListRef = ref(storage);
    const [detectedVoice, setDetectedVoice] = useState('');
    const [progress, setProgress] = useState(0);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [assistantVoiceContent, setAssistantVoiceContent] = useState('');
    const [Assistantgender, setAssistantgender] = useState('dilfuza');
    const [GptMessage, setGptMessage] = useState('');
    const [account, setAccount] = useState(false)
    const [displayText, setDisplayText] = useState('');
    const [checked, setChecked] = useState(false)
    const [isAssistantVoiceReady, setIsAssistantVoiceReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [MessageFromIF, setMessageFromIF] = useState('')
    const [VoiceTrue, setVoiceTrue] = useState(false)
    const [GptMessageiSDisplay, setGptMessageiSDisplay] = useState('')
    const MusicRef = useRef(null)
    const [catchs, setCatchs] = useState(false)
    const [LoadingNewUser, setLoadingNewUser] = useState(true)
    const [GptMessageLaunguage, setGptMessageLaunguage] = useState('')
    const [LoadingPage, setLoadingPage] = useState(true)
    const [dark, setDark] = useState(false);
    const [musicList, setMusicList] = useState([])
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



    useEffect(() => {
        if (localStorage.getItem('NewUser') !== 'not_new_user') {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        localStorage.setItem('NewUser', "not_new_user")
                        setLoadingPage(false)
                        setLoadingNewUser(localStorage.getItem('NewUser') === 'not_new_user' ? false : true)
                        console.log(LoadingNewUser);
                        return () => {
                            clearInterval(timer);
                        };
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 1000);

        } else {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        setLoadingPage(false)
                        return () => {
                            clearInterval(timer);
                        };
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 10);

        }

        listAll(MusicListRef)
            .then((response) => {
                // Barcha fayllar uchun URL lar to'plamini saqlash uchun ro'yxat
                const urls = response.items.map((itemRef) => {
                    // Fayl nomini olish
                    const fileName = itemRef.name;

                    return getDownloadURL(itemRef)
                        .then((url) => {
                            return { name: fileName, url: url };
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error);
                            return null;
                        });
                });


                // Hamma URL lar ishlangandan keyin state ni yangilash
                Promise.all(urls)
                    .then((downloadUrls) => {
                        setMusicUrls(downloadUrls.filter((item) => item !== null));
                    })
                    .catch((error) => {
                        console.error('Error getting download URLs:', error);
                    });
            })
            .catch((error) => {
                console.error('Error listing files:', error);
            });
    }, []);

    console.log(MusicUrls);
    const stopRecognition = () => {
        setIsRecognizing(false);
        setDetectedVoice('');
    };

    const ToggleDarkMode = () => {
        setDark(!dark);
    };
    const TogglShowAccount = () => {
        setAccount((prev) => !prev);
        setChecked((prev) => !prev);
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
            detectedVoice === 'salom aleykum' ||
            detectedVoice === 'salomalekum' ||
            detectedVoice === 'asalom' ||
            detectedVoice === 'assalom' ||
            detectedVoice === 'assalomu aleykum' ||
            detectedVoice === 'assalomu alekum' ||
            detectedVoice === 'assalom alekum' ||
            detectedVoice === 'salomat'
        ) {
            setMessageFromIF(``)
            const reqRandom = ["Vo alekum Assalom", `Assalomu Aleykum! ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')} aka! sizga qanday yordam berishim mumkin?`, "Assalomu Aleykum!, ko'nglingiz nima hoxlaydi!", `Assalom Aleykum! amringizga muntazirman ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')} aka!!!`];
            const randomIndex = Math.floor(Math.random() * reqRandom.length);
            setGptMessage(reqRandom[randomIndex]);
            setMessageFromIF(reqRandom[randomIndex])

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
            const reqRandom = ["Menga qanday savolingiz bor?", `menga qanday savolingiz bor? ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')} aka`, "Savolingiz bormi?", "Savollar bo'sa bemalol"];
            const randomIndex = Math.floor(Math.random() * reqRandom.length);
            setGptMessage(reqRandom[randomIndex]);
            setMessageFromIF(reqRandom[randomIndex])
            setVoiceTrue(true)
        } else if (
            detectedVoice === 'qolingdan nima keladi' ||
            detectedVoice === 'qolingizdan nima keladi' ||
            detectedVoice === 'qulingdan nima keladi' ||
            detectedVoice === 'qulingizdan nima keladi' ||
            detectedVoice === 'nima qila olasan' ||
            detectedVoice === 'nima qilolasan' ||
            detectedVoice === 'nimalar qila olasan' ||
            detectedVoice === 'nimalar qilolasan' ||
            detectedVoice === 'nimalar qilishing mumkin' ||
            detectedVoice === 'nima qilishing mumkin' ||
            detectedVoice === 'nima qilishni bilasan' ||
            detectedVoice === 'nima qilish  qolingdan keladi'

        ) {
            const reqRandom = "Suxbatlashish bo'lsa bemalol vaa savollarga javob berishim mumkin, malum vazifalar qilishim mumkin"

            setGptMessage(reqRandom);
            setMessageFromIF(reqRandom)
            setVoiceTrue(true)
        } else if (
            detectedVoice === "musiqa qoy" ||
            detectedVoice === "qoʻshiq qoʻy" ||
            detectedVoice === "qoʻshiq qoyvor" ||
            detectedVoice === "qoʻshiq qo'yvor" ||
            detectedVoice === "musiqa qo'yvor" ||
            detectedVoice === "musiqa qoʻyvor" ||
            detectedVoice === "musiqa qoya olasanmi" ||
            detectedVoice === "musiqa qoʻya olasanmi" ||
            detectedVoice === "qoʻshiqlar" ||
            detectedVoice === "taronalar" ||
            detectedVoice === "qoshiqlar" ||
            detectedVoice === "ashulalar roʻyxati" ||
            detectedVoice === "taronalar royxati" ||
            detectedVoice === "qoʻshiqlar royxati" ||
            detectedVoice === "musiqa qoy" ||
            detectedVoice === "musiqa" ||
            detectedVoice === "ashula" ||
            detectedVoice === "tarona eshitmoqchiman" ||
            detectedVoice === "tarona eshitmoqchi man" ||
            detectedVoice === "qoʻshiq eshitmoqchiman" ||
            detectedVoice === "qoʻshiq eshitmoqchi man" ||
            detectedVoice === "musiqa eshitmoqchiman" ||
            detectedVoice === "musiqa eshitmoqchi man"
        ) {
            const reqRandom = "Yaxshi, qanday qo'shiq eshitmoqchisiz menda hozircha faqat shular!"

            setGptMessage(reqRandom);
            setMessageFromIF(reqRandom)
            setVoiceTrue(true)
        } else {
            const GptfetchData = async () => {

                const options = {
                    method: 'POST',
                    url: 'https://chatgpt-api8.p.rapidapi.com/',
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '338be19902mshc80180f0026f9eep1a50f0jsn14646f3ebe1c',
                        'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
                    },
                    // 338be19902mshc80180f0026f9eep1a50f0jsn14646f3ebe1c
                    data: [
                        {
                            content: detectedVoice,
                            role: 'user',
                        },

                    ],
                };

                setIsLoading(true)

                try {
                    const response = await axios.request(options);
                    const assistantVoice = response.data.text;
                    console.log(assistantVoice);
                    setIsLoading(false)
                    setGptMessage(assistantVoice);

                } catch (error) {
                    console.error(error);
                    const reqRandom = ["Obooo, yana sizmi", `Iltimos ${localStorage.getItem('name') === null ? user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName : localStorage.getItem('name')}  aka! kiyinroq qayta urinib ko'ring!`, "Tarmoqda Nosozlik yuzaga keldi, Iltimos qayta urinib ko'ring!"];
                    const randomIndex = Math.floor(Math.random() * reqRandom.length);
                    setGptMessage(reqRandom[randomIndex]);
                    setCatchs(true)
                }
            };
            GptfetchData();
        }
        console.log(musicList);


        setAssistantVoiceContent(null);

    }, [detectedVoice]);
    useEffect(() => {
        const launguageGptMessage = franc(GptMessage)
        if (launguageGptMessage === 'uzn' || launguageGptMessage === "und" || catchs === true) {

        } else if (launguageGptMessage === 'eng' || launguageGptMessage === 'rus' || launguageGptMessage === 'arb' || launguageGptMessage === "tur") {
            setVoiceTrue(false)
            setGptMessage("Savolingizga chunmadim qaytara olasizmi")

        }
        console.log(launguageGptMessage);

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
                        model: Assistantgender,
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




    const handleChangeAssistantGender = (e) => {
        if (e.target.value === 'erkak') {
            setAssistantgender('davron')
        }
        else {
            setAssistantgender('dilfuza')
        }
    };


    function removeRepeatedUnderscores(text) {
        const regex = /_/g;
        return text.replace(regex, ' ');
    }
    function MusicName(musicName) {
        const regex = /\.mp3/g;
        return musicName.replace(regex, '');
    }
    const [isMusicPlaying, setIsMusicPlaying] = useState([]);


    const handlePlay = (audioIndex) => {
        setIsMusicPlaying((prevPlaying) => [...prevPlaying, audioIndex]);
    };

    const handlePause = (audioIndex) => {
        setIsMusicPlaying((prevPlaying) =>
            prevPlaying.filter((index) => index !== audioIndex)
        );
    };


    if (LoadingPage === true) {
        return (
            <>
                <div className="AppLoading">
                    <Box className='LoadingLine' sx={{ width: '40%' }}>
                        <LinearProgress variant="determinate" value={progress} />

                    </Box>
                </div>
            </>
        )
    } else {
        return (
            <>
                <section className={dark === true ? 'App dark' : 'App'} >

                    <div className='Account'>
                        <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} className='AccountLogo' src={null} alt='Error img' />
                        <Grow in={checked}>
                            <div className='Account_Bar' style={{ maxWidth: '300px', height: '350px', borderRadius: "20px", position: 'absolute', backgroundColor: 'rgb(231, 231, 231)', display: account === false ? 'none' : 'block' }}>
                                <IconButton sx={{ position: 'absolute', right: '10px', top: '10px' }} onClick={TogglShowAccount}>
                                    <Close className='AccountClose' />
                                </IconButton>
                                <Box mt={5} ml={1} display={"flex"} alignItems={"center"}>
                                    <Avatar onClick={TogglShowAccount} style={{ width: '50px', height: '50px' }} src={<VerifiedUser className='AccountLogo' />} />

                                    <Typography className='AccountInfo' ml={1} >
                                        {user?.displayName === null ? user?.email?.replace('@gmail.com', '').replace(/[0-9]/g, '') : user?.displayName}
                                        <CheckCircle sx={{ fontSize: '12px', color: '#007bff', ml: '5px' }} />
                                    </Typography>
                                </Box>
                                <Box mt={2} ml={2} display={"flex"} alignItems={"center"}>
                                    <Typography className='AccountMode'>
                                        Tun rijimi
                                        <Switch {...label} checked={dark} onChange={ToggleDarkMode} />
                                    </Typography>
                                </Box>
                                <Box ml={2} mt={1} >
                                    <h2 className='asssistantGenderh2'>Assistant ovozi:</h2>
                                    <form onChange={handleChangeAssistantGender}>


                                        <select onChange={handleChangeAssistantGender} className='AssistantGender'>
                                            <option >Ayol</option>
                                            <option >erkak</option>
                                        </select>

                                    </form>
                                </Box>
                                <Box marginTop={"50px"} display={"flex"} justifyContent={"center"} >
                                    <Button sx={{ margin: '20px' }} onClick={SignOutHandler} variant="outlined" className='AccountOutButton' color="error">
                                        Akkauntdan Chiqish
                                    </Button>
                                </Box>
                            </div>
                        </Grow>
                    </div>


                    <button id='MicrophoneButton' className={isRecognizing ? 'MicrophoneButtonOn' : 'MicrophoneButtonOff'} onClick={toggleRecognition}>

                        {isRecognizing ? <p>Gapiring</p> : <KeyboardVoice className='MicrophoneIcon ' />}
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

                                    <audio id="audioPlayer" src={assistantVoiceContent} autoPlay />
                                    {GptMessageiSDisplay === '' ? (<></>) : (
                                        <>
                                            <Grow in={true}>
                                                <div className='WrapDetectedVoice' >

                                                    <div className='BoxDetectedVoice'  >
                                                        <div onClick={() => setGptMessageiSDisplay('')} >
                                                            <Close className='CloseDetectedVoice' />

                                                        </div>
                                                        <Box mt={1}   >
                                                            {GptMessageiSDisplay === "Yaxshi, qanday qo'shiq eshitmoqchisiz menda hozircha faqat shular!" ? (
                                                                <>
                                                                    <p className='DetectedVoice' >{GptMessageiSDisplay}</p>
                                                                    {MusicUrls.map((list, num) => (
                                                                        <>
                                                                            <div className={`wrap_audioCard ${isMusicPlaying.includes(num + 1) ? `played  ` : ''}`}>
                                                                                <p style={{ fontSize: "16px", paddingBottom: "10px" }} className='DetectedVoices' >{num + 1}) {removeRepeatedUnderscores(MusicName(list.name))}</p>
                                                                                <audio onPlay={() => handlePlay(num + 1)}
                                                                                    onPause={() => handlePause(num + 1)} type="audio/mpeg" className={`Musics`} src={list.url} controls ></audio>
                                                                            </div >
                                                                        </>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <p className='DetectedVoice' >{GptMessageiSDisplay}</p>
                                                            )}
                                                        </Box>
                                                    </div>
                                                </div>

                                            </Grow>
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
}

export default Dashboard;
