import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [detectedVoice, setDetectedVoice] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [assistantVoiceContent, setAssistantVoiceContent] = useState('');
  const [GptMessage, setGptMessage] = useState('');
  const [isAssistantVoiceReady, setIsAssistantVoiceReady] = useState(false);
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
          'X-RapidAPI-Key': '962a773fcdmsh5911332d3f70240p1f8e05jsne25fabd1ec9a',
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
          setAssistantVoiceContent(voiceUrl);
          setIsAssistantVoiceReady(true);
        } catch (error) {
          console.error(error);
        }
      }
    };

    voiceFetchData();
  }, [GptMessage, detectedVoice]);
  const isAudioPlaying = useRef(false);

  useEffect(() => {
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
  }, [isAssistantVoiceReady]);

  return (
    <>
      <button onClick={toggleRecognition}>
        {isRecognizing ? 'To\'xtatish' : 'Gapiring'}
      </button>
      <h1>Hello World!!!</h1>
      <h1>{detectedVoice}</h1>

      {isAssistantVoiceReady && (
        <audio ref={audioRef} id="audioPlayer" src={assistantVoiceContent} controls autoPlay />
      )}
    </>
  );
}

export default App;
