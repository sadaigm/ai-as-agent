import { text } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { useSubmitHandler } from "../../../hooks/useSubmitHandler";
import { AgentToolFunctionResponse } from "../../../core/AgentToolFunction";
import { UserMessage, ToolMessage, SystemMessage } from "../../types/tool";

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

  const callAgent = (
    transcript: string,
    systemPrompt: string,
    useConversation: boolean = false,
    conversation: Array<
      UserMessage | ToolMessage | AgentToolFunctionResponse | SystemMessage
    >
  ) => {
    const trimmedConversation = conversation.filter((msg) => {
      if (
        (msg.role === "user" || msg.role === "assistant") &&
        "content" in msg &&
        typeof msg.content === "string" &&
        (msg.content.trim() === "" || msg.content.trim() === "No response")
      ) {
        return false; // Skip empty user messages
      }
      return true; // Keep all other messages
    });
    console.log("Trimmed conversation:", trimmedConversation);
    const payload = {
      model: localStorage.getItem("selectedModel") || "llama-3.2-3b-instruct",
      messages: [
        ...(useConversation
          ? [{ role: "system", content: systemPrompt }]
          : trimmedConversation),
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
