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


interface ResponseProps {
  responseData: string | null;
  streamingData: string | null;
  setResponseData: React.Dispatch<React.SetStateAction<string | null>>;
  setStreamingData: React.Dispatch<React.SetStateAction<string | null>>;
}

const PreBlock: React.FC = (props) => <pre {...props} />;
const CodeBlock: React.FC = (props) => <code {...props} />;

const ResponsePanel: React.FC<ResponseProps> = ({
  responseData,
  streamingData,
  setResponseData,
  setStreamingData,
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
      style={{ flex: 1 }}
      extra={
        <Space>
          <Button onClick={clearResponse}>Clear</Button>
        </Space>
      }
    >
      {thinkingContent ? (
        <Collapse
          bordered={false}
          defaultActiveKey={["2"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
          items={getItems(panelStyle)}
        />
      ) : parsedResponse ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: PreBlock,
            code: CodeBlock,
          }}
          children={parsedResponse}
        />
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default ResponsePanel;
