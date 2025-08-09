import React, { useState, useEffect, CSSProperties } from "react";
import {
  Card,
  Space,
  Button,
  Empty,
  Collapse,
  CollapseProps,
  theme,
} from "antd";
import { CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./response.css";
import { parseResponse } from "./response-utils";
import { AgentToolFunctionResponse } from "../../core/AgentToolFunction";
import { UserMessage, ToolMessage } from "../types/tool";

interface ResponseProps {
  responseData: string | null;
  streamingData: string | null;
  setResponseData: React.Dispatch<React.SetStateAction<string | null>>;
  setStreamingData: React.Dispatch<React.SetStateAction<string | null>>;
  useConversation: boolean;
  conversation: Array<UserMessage | ToolMessage | AgentToolFunctionResponse>;
  setConversation: React.Dispatch<
    React.SetStateAction<
      Array<UserMessage | ToolMessage | AgentToolFunctionResponse>
    >
  >;
}

const PreBlock: React.FC = (props) => <pre {...props} />;
const CodeBlock: React.FC = (props) => <code {...props} />;

const ResponsePanel: React.FC<ResponseProps> = ({
  responseData,
  streamingData,
  setResponseData,
  setStreamingData,
  useConversation,
  conversation,
  setConversation,
}) => {
  const [thinkingContent, setThinkingContent] = useState<string | null>(null);
  const [parsedResponse, setParsedResponse] = useState<string | null>("");
  const { token } = theme.useToken();

  useEffect(() => {
    if (streamingData) {
      const { thinkingContent, parsedResponse } = parseResponse(streamingData);
      setThinkingContent(thinkingContent);
      setParsedResponse(parsedResponse);
    } else if (responseData) {
      const { thinkingContent, parsedResponse } = parseResponse(responseData);
      setThinkingContent(thinkingContent);
      setParsedResponse(parsedResponse);
    } else {
      setThinkingContent(null);
      setParsedResponse("");
    }
  }, [streamingData, responseData]);

  const clearResponse = () => {
    setResponseData(null);
    setStreamingData("");
    setThinkingContent(null);
    setParsedResponse("");
    setConversation([]);
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => {
    const items: CollapseProps["items"] = [
      {
        key: "1",
        label: (
          <span style={{ color: "blue" }}>
            {parsedResponse === null ? `Thinking...` : `Initial Thoughts`}
          </span>
        ),
        extra: (
          <>
            {parsedResponse === null ? (
              <LoadingOutlined style={{ fontSize: "24px" }} />
            ) : null}
          </>
        ),
        children: (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: PreBlock,
              code: CodeBlock,
            }}
            children={thinkingContent}
          />
        ),
        style: panelStyle,
      },
    ];
    if (parsedResponse) {
      items.push({
        key: "2",
        label: "Response",
        children: (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: PreBlock,
              code: CodeBlock,
            }}
            children={parsedResponse}
          />
        ),
        style: panelStyle,
      });
    }
    return items;
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <Card
      className="agent__result"
      title="Result"
      bordered={false}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
      extra={
        <Space>
          <Button onClick={clearResponse}>Clear</Button>
        </Space>
      }
      bodyStyle={{
        flex: 1,
        padding: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {useConversation && conversation.length > 0 && (
          <div
            className="response__conversation"
            style={{
              flex: 1,
              overflow: "auto",
              marginBottom: "16px",
            }}
          >
            {conversation.map((msg, index) => {
              const message = msg as any;
              if (message.content) {
                return message.role === "user" ? (
                  <div
                    key={index}
                    className={`response__message ${message.role}`}
                  >
                    <div style={{ marginBottom: "5px" }}>
                      <strong
                        style={{
                          textTransform: "capitalize",
                          color: "#3f51b5",
                        }}
                      >
                        {message.role}:
                      </strong>
                    </div>

                    <div>
                      <span>{message.content}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`response__message ${message.role}`}
                  >
                    <div>
                      <strong
                        style={{
                          textTransform: "capitalize",
                          color: "#607d8b",
                        }}
                      >
                        {message.role}:
                      </strong>
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: PreBlock,
                        code: CodeBlock,
                      }}
                      children={message.content}
                    />
                  </div>
                );
              }
            })}
          </div>
        )}

        {thinkingContent ? (
          <div style={{ flex: 1, overflow: "auto" }}>
            <Collapse
              bordered={false}
              defaultActiveKey={["2"]}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: token.colorBgContainer }}
              items={getItems(panelStyle)}
            />
          </div>
        ) : parsedResponse ? (
          <div style={{ flex: 1, overflow: "auto" }}>
            <div>
              <strong style={{ textTransform: "capitalize" }}>
                {"assistant"}:
              </strong>
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: PreBlock,
                code: CodeBlock,
              }}
              children={parsedResponse}
            />
          </div>
        ) : conversation.length > 0 ? (
          <></>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResponsePanel;
