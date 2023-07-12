import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import axios from "axios"
function App() {

  const [DetectedVoice, setDetectedVoice] = useState(''); // Ovoz natijasini saqlash uchun holat ustunligi
  const [isRecognizing, setIsRecognizing] = useState(false); // Ovozni aniqlash holatini saqlash uchun holat ustunligi
  const [AsistantVoice, setAssistantVoice] = useState(null)
  const [AsistantVoiceContent, setAssistantVoiceContent] = useState(null)
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
    if (DetectedVoice === '') {

    } else if ( DetectedVoice === "Assalomaleykum sizning ismingiz nima" || DetectedVoice === "Assalom sizning ismingiz nima" || DetectedVoice === "Assalom sizning ismingiz nima?" || DetectedVoice === "Assalom aleykum sizning ismingiz nima?" || DetectedVoice === "salom sening isming nima" || DetectedVoice === "salom sening isming nima?" || DetectedVoice === "Salom senzning ismingiz nima" || DetectedVoice === "Salom senzning ismingiz nima?") {

    } else if (DetectedVoice === "seni kim yaratdi?" || DetectedVoice === "seni kim yasadi" || DetectedVoice === "sizni kim yasadi" ||  DetectedVoice === "sizni kim dasturladi" || DetectedVoice === "seni kim dasturladi?" || DetectedVoice === "sizni kim dasturladi?") {

    } else if (DetectedVoice === "") {

    } else {

      const GptfetchData = async () => {
        const options = {
          method: 'POST',
          url: 'https://chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com/v1/chat/completions',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'e760741a4fmshc16220c60bf4c5fp1bd712jsn7e1afbd3e64a',
            'X-RapidAPI-Host': 'chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com'
          },
          data: {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: DetectedVoice
              }
            ],
            temperature: 0.8
          }
        };

        try {
          const response = await axios.request(options);
          console.log(response.data.choices?.[0].message.content);
        } catch (error) {
          console.error(error);
        }
      }

      // GptfetchData()

    }
    if (AsistantVoice === null) {

    } else {

      const VoicefetchData = async () => {
        if (DetectedVoice !== '') {
          const config = {
            method: 'post',
            url: 'https://studio.mohir.ai/api/v1/tts',
            headers: {
              Authorization: import.meta.env.VITE_VOICE_API_KEY,
              "Content-type": "application/json"
            },
            data: {
              text: AsistantVoice,
              model: "dilfuza"
            },
          };
          try {
            const response = await axios(config);
            console.log(response.data.result.url);
            AsistantVoiceContent(response.data.result.url)

          } catch (error) {
            console.error(error);
          }
        }
      };

      //   VoicefetchData();

    }
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
