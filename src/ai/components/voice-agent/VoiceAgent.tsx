import { message, Select, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import useSpeechDetector from "./hooks/useSpeechDetector";
import RecordButton from "./components/RecordButton";
import StopButton from "./components/StopButton";
import ClearButton from "./components/ClearButton";
import useSpeechProcessor from "./hooks/useSpeechProcessor";
import Speaking from "./components/Speaking";
import { defaultSystemPrompt } from "./consts";
import {
  SystemMessage,
  SystemRolePrompt,
  ToolMessage,
  UserMessage,
} from "../types/tool";
import useAgent from "./hooks/useAgent";
import ResponsePanel from "../response/ResponsePanel";
import { AgentToolFunctionResponse } from "../../core/AgentToolFunction";
import AIProcessing from "./components/AIProcessing";
import { hindiIntroText, tamilIntroText } from "./SpeechToTextRecorder";
import useScreenSize from "../../hooks/useScreenSize";
import "./VoiceAgent.css";

const VoiceAgent = () => {
  const { screenSize } = useScreenSize();
  const [agentPrompt] = useState<SystemRolePrompt>({
    systemRole: "Friday Voice Agent",
    systemPrompt: defaultSystemPrompt,
    id: "friday-voice-agent-prompt",
  });
  const [useConversationChat, setuseConversationChat] = useState(false);
  const [transcript, setTranscript] = React.useState<string>("");
  const [fullscript, setFullscript] = React.useState<string>("");
  const [conversation, setConversation] = useState<
    Array<UserMessage | ToolMessage | AgentToolFunctionResponse | SystemMessage>
  >([]);

  const {
    isSpeaking,
    speak,
    stopSpeaking,
    status,
    streamHandler,
    selectedVoice,
    setSelectedVoice,
  } = useSpeechProcessor();
  const {
    loading: agentLoading,
    responseData,
    streamingData,
    callAgent,
    setResponseData,
    setStreamingData,
    abortController,
    setLoading,
  } = useAgent();
  const {
    isRecording,
    startSpeechDetection,
    stopSpeechDetection,
    clearSpeechDetection,
    recordedText,
    error,
    setError: setSpeechDetectorError,
  } = useSpeechDetector();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Fetch voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      if (voicesList.length > 0 && !selectedVoice) {
        setSelectedVoice(voicesList[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  //   // Update speak to use selectedVoice
  //   const speakWithVoice = (text: string, lang = "en-US", welcome = false) => {
  //     if (selectedVoice) {
  //       speak(text, selectedVoice.lang, welcome, selectedVoice);
  //     } else {
  //       speak(text, lang, welcome);
  //     }
  //   };

  useEffect(() => {
    if (recordedText) {
      console.log("Recorded Text:", recordedText);
      if (selectedVoice && selectedVoice.lang) {
        agentPrompt.systemPrompt += `\n\n User's language: ${selectedVoice.lang}`;
      }
      setFullscript((prev) => prev + transcript);
      console.log("Full script:", fullscript);
      setTranscript("");
      setResponseData(null);
      setStreamingData("");
      setConversation((prev) => [
        ...prev,
        { role: "user", content: recordedText },
      ]);
      callAgent(
        recordedText,
        agentPrompt.systemPrompt,
        useConversationChat,
        conversation
      );
      //   setTranscript(recordedText);
      //   speak(recordedText); // Assuming you want to speak the recorded text
      //   invoke the speak here
    } else {
      console.log("no content to speak recording :", isRecording);
    }
  }, [recordedText, isRecording]);

  const startWelcome = () => {
    console.log("Starting welcome message");
    if (selectedVoice && selectedVoice.lang === "ta-IN") {
      speak(tamilIntroText, "ta-IN", true);
    } else if (selectedVoice && selectedVoice.lang === "hi-IN") {
      speak(hindiIntroText, "hi-IN", true);
    } else {
      speak(
        "Welcome! I'm Friday! How can I assist you today?",
        selectedVoice?.lang || "en-US",
        true
      );
    }
    setConversation((prev) => [
      ...prev,
      { role: "system", content: agentPrompt.systemPrompt },
    ]);
    // startSpeechDetection();
  };
  useEffect(() => {
    if (status === "welcome-ended") {
      stopSpeechDetection(); // Ensure recording is stopped before speaking
      stopSpeaking();
      console.log("Welcome message ended, starting speech detection");
      startSpeechDetection();
    } else if (status === "ended") {
      stopSpeechDetection(); // Stop recording before handling response
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: transcript || responseData || streamingData || "No response",
        },
      ]);
      stopSpeaking();
      startSpeechDetection(); // Only start listening after speaking is fully stopped
    } else if (status === "error") {
      console.error("An error occurred during speech processing");
      stopSpeechDetection(); // Stop recording on error
      stopSpeaking();
    }
  }, [status]);

  useEffect(() => {
    if (error && error === "no-speech") {
      message.error("No speech detected. Please try again.");
      speak("No speech detected. Please try again.");
      setSpeechDetectorError(""); // Clear the error after handling it
    }
  }, [error]);

  const stopEverything = () => {
    stopSpeechDetection();
    stopSpeaking();
    setTranscript("");
    console.log("Stopped all operations");
  };

  const handleClear = () => {
    clearSpeechDetection();
    setTranscript("");
    stopSpeaking();
    setConversation([]);
    console.log("Cleared all speech detection and transcript");
  };
  useEffect(() => {
    if (streamingData) {
      console.log("streamingData:", streamingData);
      setTranscript((prev) => prev + streamingData);
      streamHandler(streamingData, selectedVoice?.lang || "en-US");
      console.log("Updated transcript with streaming data:", streamingData);
    }
  }, [streamingData]);

  return (
    <div
      className="voice-agent-container"
      style={{
        display: "flex",
        flexDirection: "column",
        padding:
          screenSize === "mobile"
            ? "8px"
            : screenSize === "tablet"
            ? "12px"
            : "16px",
        height: "100%",
        width: "100%",
        maxWidth: "none",
        margin: "0",
        backgroundColor: "#f4f4ea",
        overflow: "hidden",
      }}
    >
      <div
        className="voice-agent-header"
        style={{
          marginBottom: "16px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}
        >
          Voice Agent : {agentPrompt.systemRole}
        </h1>
        <p
          style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            margin: "0 0 16px 0",
            textAlign: "center",
            color: "#666",
          }}
        >
          This component will handle voice interactions.
        </p>

        {/* Voice selection dropdown */}
        <div style={{ width: "100%", marginBottom: 16 }}>
          <Select
            showSearch
            style={{ width: "100%" }}
            value={selectedVoice?.voiceURI}
            onChange={(voiceURI) => {
              const found = voices.find((v) => v.voiceURI === voiceURI);
              setSelectedVoice(found || null);
            }}
          >
            {voices.map((voice, idx) => (
              <Select.Option
                key={`${voice.voiceURI}-${idx}`}
                value={voice.voiceURI}
              >
                {voice.name}
                {voice.lang ? ` (${voice.lang})` : ""}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Control buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: screenSize === "mobile" ? "8px" : "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
            flexDirection: screenSize === "mobile" ? "column" : "row",
          }}
        >
          {/* Use Conversation Checkbox */}
          <Checkbox
            checked={useConversationChat}
            onChange={(e) => setuseConversationChat(e.target.checked)}
            style={{
              fontSize: screenSize === "mobile" ? "14px" : "16px",
              marginRight: screenSize === "mobile" ? "0" : "16px",
              marginBottom: screenSize === "mobile" ? "8px" : "0",
            }}
          >
            Use Conversation
          </Checkbox>

          {isRecording ? (
            <StopButton onClick={stopEverything} />
          ) : (
            <RecordButton onClick={startWelcome} />
          )}

          {isSpeaking ? (
            <Speaking />
          ) : (
            agentLoading && (
              <AIProcessing
                onAbort={() => {
                  if (abortController) {
                    abortController.abort();
                    message.warning("Request was canceled");
                    setLoading(false);
                  }
                }}
              />
            )
          )}

          <ClearButton onClick={handleClear} />
        </div>
      </div>

      {/* Response Panel Container */}
      <div
        className="voice-agent-response"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <ResponsePanel
          useConversation={useConversationChat}
          conversation={conversation}
          setConversation={setConversation}
          responseData={responseData}
          streamingData={transcript}
          setResponseData={setResponseData}
          setStreamingData={setStreamingData}
        />
      </div>

      {error && (
        <div
          style={{
            color: "#f5222d",
            marginTop: "8px",
            textAlign: "center",
            fontSize: "0.9rem",
            flexShrink: 0,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
