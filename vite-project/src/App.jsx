import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import axios from "axios"
function App() {

  const [DetectedVoice, setDetectedVoice] = useState(''); // Ovoz natijasini saqlash uchun holat ustunligi
  const [isRecognizing, setIsRecognizing] = useState(false); // Ovozni aniqlash holatini saqlash uchun holat ustunligi

  const startRecognition = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = 'uz-UZ'; // Ovozni aniqlash uchun tilni belgilang

    setIsRecognizing(true); // Ovozni aniqlash holatini true qilish

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setDetectedVoice(transcript);
      setIsRecognizing(false); // Ovozni aniqlash holatini false qilish
    };

    recognition.start();
  };

  const stopRecognition = () => {
    setIsRecognizing(false); // Ovozni aniqlash holatini false qilish
    setDetectedVoice(''); // Ovozni to'xtatish
  };

  const toggleRecognition = () => {
    if (isRecognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };
  useLayoutEffect(() => {
    const fetchData = async () => {
      if (DetectedVoice !== '') {
        const config = {
          method: 'post',
          url: 'https://studio.mohir.ai/api/v1/tts',
          headers: {
            Authorization: import.meta.env.VITE_VOICE_API_KEY,
            "Content-type": "application/json"
          },
          data: {
            text: DetectedVoice,
            model: "dilfuza"
          },
        };
        try {
          const response = await axios(config);
          console.log(response.data.result.url);
          
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    fetchData();
  }, [DetectedVoice]);
  
  return (
    <>
      <button onClick={toggleRecognition}>
        {isRecognizing ? 'To\'xtatish' : 'Gapiring'}
      </button>
      <h1>Hello World!!!</h1>
      <h1>{DetectedVoice}</h1>
      <audio ></audio>
    </>
  );
}

export default App;
