import { useRef, useState } from "react";

const useSpeechProcessor = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const isProcessingRef = useRef(false);
  const bufferRef = useRef("");

  const queueRef = useRef<string[]>([]);

  function streamHandler(textChunk: string, lang: string = "en-US") {
    console.log("Processing text chunk:", textChunk);
    bufferRef.current += textChunk;

    const trimmed = bufferRef.current.trim();
    const isLongEnough = trimmed.length >= 50;
    const hasSentenceEnd = /[.?!]\s?$/.test(trimmed);

    console.log(
      "Received text chunk:",
      textChunk,
      "Buffering...",
      bufferRef.current
    );

    if (isLongEnough || hasSentenceEnd) {
      console.log("Buffering text chunk:", trimmed);
      // Cleanse symbols and emojis before pushing to queue
      const cleansed = cleanseSymbols(removeEmojis(trimmed));
      pushToQueue(cleansed, lang);
      bufferRef.current = ""; // Clear buffer after speaking
    }
  }

  const processQueue = (lang: string = "en-US") => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    // Skip all empty strings at the start of the queue
    while (queueRef.current.length > 0 && queueRef.current[0].trim() === "") {
      queueRef.current.shift();
    }

    // If queue is now empty after removing empty strings, return
    if (queueRef.current.length === 0) return;

    const nextChunk = queueRef.current.shift();
    if (nextChunk) {
      isProcessingRef.current = true;
      speak(nextChunk, lang);
    }
  };

  const pushToQueue = (chunk: string, lang: string = "en-US") => {
    // Skip empty chunks
    if (chunk.trim() === "") {
      console.log("Skipping empty chunk");
      return;
    }

    if (queueRef.current.length == 0) {
      queueRef.current.push(chunk);
      processQueue(lang);
    } else {
      queueRef.current.push(chunk);
    }
    console.log("Chunk added to queue:", chunk);
  };

  const speak = (text: string, lang: string = "en-US", isWelcome?: boolean) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = 1.2;
    utterance.volume = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus("speaking");
      console.log("Speech started");
    };
    utterance.onend = () => {
      if (isWelcome) {
        setIsSpeaking(false);
        setStatus("welcome-ended");
      } else {
        if (
          queueRef.current.length === 0 ||
          queueRef.current.every((chunk) => chunk.trim() === "")
        ) {
          setIsSpeaking(false);
          setStatus("ended");
          console.log("Status:  ended");
        }
      }

      console.log(queueRef.current);

      console.log("Speech ended");
      setIsSpeaking(false);
      utteranceRef.current = null;
      isProcessingRef.current = false;
      if (!isWelcome) {
        processQueue(lang); // Process the next chunk in the queue
      }
    };
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      isProcessingRef.current = false;
      setStatus("error");
      console.error("Speech error:", event);
      processQueue(lang);
    };
    window.speechSynthesis.speak(utterance);
  };
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setStatus("stopped");
      console.log("Speech stopped");
      utteranceRef.current = null;
    }
  };

  return {
    isSpeaking,
    status,
    speak,
    stopSpeaking,
    streamHandler,
    setSelectedVoice,
    selectedVoice,
  };
};
export default useSpeechProcessor;

export function removeEmojis(text: string): string {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
    ""
  );
}

const SYMBOLS = [
  ".",
  "?",
  "!",
  ",",
  ";",
  ":",
  "-",
  "_",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  '"',
  "'",
  "`",
  "~",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "+",
  "=",
  "<",
  ">",
  "/",
  "\\",
  "|",
];

export function cleanseSymbols(text: string): string {
  // Remove symbols if they appear as standalone characters (surrounded by spaces or at start/end)
  const symbolPattern = new RegExp(
    `\\s*([${SYMBOLS.map((s) => "\\" + s).join("")}])\\s*`,
    "g"
  );
  return text.replace(symbolPattern, " ").replace(/\s+/g, " ").trim();
}
