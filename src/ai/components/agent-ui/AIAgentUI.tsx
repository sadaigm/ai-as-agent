import { useEffect, useState } from "react";
import {
  Row,
  Col,
} from "antd";
import "./aiagent.css";
import {
  ChatHistory,
  ToolMessage,
  UserMessage,  
} from "../types/tool";
import ResponsePanel from "../response/ResponsePanel";
import FormSection from "./FormSection";
import { AgentToolFunctionResponse } from "../../core/AgentToolFunction";

const AIAgentUI = () => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<string|null>(null);
  const [streamingData, setStreamingData] = useState<string|null>("");
  const [chatHistory, setchatHistory] = useState<ChatHistory>({});
  const [useConversation, setUseConversation] = useState(false); // New state for checkbox

  const [conversation, setConversation] = useState<
    Array<UserMessage | ToolMessage | AgentToolFunctionResponse>
  >([]);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    if (!loading && (responseData || streamingData)) {
      if (responseData) {
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: responseData },
        ]);
      } else if (streamingData) {
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: streamingData },
        ]);
      }
    }
  }, [loading, responseData, streamingData]);

  useEffect(() => {
    console.log("debug", { conversation });
  }, [conversation]);

  useEffect(() => {
    console.log("debug", { chatHistory });
  }, [chatHistory]);

  console.log({ streamingData });

  return (
    <Row className="ai__agent" gutter={24} style={{ height: "100%" }}>
      {/* Left Column - Form Section */}
      <Col
        span={11}
        style={{
          height: "calc(100% - 30px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FormSection
          setConversation={setConversation}
          setLoading={setLoading}
          setResponseData={setResponseData}
          setStreamingData={setStreamingData}
          setAbortController={setAbortController}
          conversation={conversation}
          chatHistory={chatHistory}
          setchatHistory={setchatHistory}
          useConversation={useConversation}
          setUseConversation={setUseConversation}
          loading={loading}
          abortController={abortController}
        />
      </Col>

      {/* Right Column - Result Panel */}
      <Col
        span={11}
        style={{
          height: "calc(100% - 30px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ResponsePanel responseData={responseData} streamingData={streamingData} 
        setResponseData={setResponseData} setStreamingData={setStreamingData} />
      </Col>
    </Row>
  );
};

export default AIAgentUI;
