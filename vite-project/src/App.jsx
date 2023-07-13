import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from "@mui/material"
import "./App.css"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [detectedVoice, setDetectedVoice] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [assistantVoiceContent, setAssistantVoiceContent] = useState('');
  const [GptMessage, setGptMessage] = useState('');
  const [isAssistantVoiceReady, setIsAssistantVoiceReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const audioRef = useRef(null);

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
    if (setDark) {
      setDark(false);
    } else {
      setDark(true);
    }
  }
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
          'X-RapidAPI-Key': '562510d369msh5e48ae7296492d8p16e885jsn80041d9e143d',
          'X-RapidAPI-Host': 'chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com',
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
            Authorization: import.meta.env.VITE_VOICE_API_KEY,
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
          setAssistantVoiceContent(null);
          setTimeout(() => {
            setAssistantVoiceContent(voiceUrl);
            setIsLoading(false);

          }, 500);
          setIsAssistantVoiceReady(true);
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






  return (
    <>
      <button onClick={toggleRecognition}>
        {isRecognizing ? 'To\'xtatish' : 'Gapiring'}
      </button>

      <h1>{detectedVoice}</h1>
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

    </>
  );
}

export default App;
