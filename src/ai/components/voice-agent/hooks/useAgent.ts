import { text } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { useSubmitHandler } from "../../../hooks/useSubmitHandler";

const useAgent = () => {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [streamingData, setStreamingData] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
    chuckStreamData: true, // Set to true to handle chunked streaming data
  });

  const callAgent = (transcript: string, systemPrompt: string) => {
    const payload = {
      model: localStorage.getItem("selectedModel") || "llama-3.2-3b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript.trim() },
      ],
      temperature: 0.9,
      stream: true,
    };
    handleSubmit(payload);
  };
  return {
    responseData,
    streamingData,
    loading,
    callAgent,
    abortController,
    setAbortController,
    setResponseData,
    setStreamingData,
    setLoading,
  };
};

export default useAgent;
