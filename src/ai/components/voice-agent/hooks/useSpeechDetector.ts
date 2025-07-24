import { useRef, useState } from "react";

const useSpeechDetector = () => {
  const [recordedText, setRecordedText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSpeechDetection = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setRecordedText("");
      console.log("Speech detection started");
    };

    recognitionRef.current.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setRecordedText(text);
      console.log("Speech detected:", text);
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsRecording(false);
      setRecordedText("");
      console.error("Speech detection error:", event.error);
      setError(event.error || "Unknown error");
    };
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      console.log("Speech detection ended");
    };

    recognitionRef.current.start();
    console.log("Speech detection initialized");
  };

  const stopSpeechDetection = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      console.log("Speech detection stopped");
      setRecordedText("");
    }
  };

  const clearSpeechDetection = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
      }
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onstart = null;
      recognitionRef.current.onend = null;
      recognitionRef.current = null;
    }
    setRecordedText("");
    setIsRecording(false);
    console.log("Speech detection cleared");
  };

  return {
    recordedText,
    isRecording,
    startSpeechDetection,
    stopSpeechDetection,
    clearSpeechDetection,
    error,
    setError,
  };
};

export default useSpeechDetector;
