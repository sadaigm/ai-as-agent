import { Card, Collapse, CollapseProps, Empty, theme } from "antd";
import { CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock, { PreBlock } from "../../../../components/response/CodeBlock";
import { parseResponse } from "../../../../components/response/response-utils";

type WorkflowResponseProps = {
  response: string;
  status: string;
};

const WorkflowResponse: FC<WorkflowResponseProps> = ({ response, status }) => {
  const { token } = theme.useToken();
  const [thinkingContent, setThinkingContent] = useState<string | null>(null);
  const [parsedResponse, setParsedResponse] = useState<string | null>("");

  useEffect(() => {
    console.log(response);
    if (response) {
      const { thinkingContent, parsedResponse } = parseResponse(response);
      setThinkingContent(thinkingContent);
      setParsedResponse(parsedResponse);
    } else {
      setThinkingContent(null);
      setParsedResponse("");
    }
  }, [response]);

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
      title={<span>Response</span>}
      style={{ width: "100%", display: "flex", flexDirection: "column" }}
      className="ai__workflow-result"
      extra={
        <>
          {status == "Running" && (
            <span style={{ color: "#3f51b5" }}>
              <LoadingOutlined style={{ fontSize: "18px", marginRight:"10px" }} />
              {"Processing..."}
            </span>
          )}
        </>
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
        <>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: PreBlock,
              code: CodeBlock,
            }}
            children={parsedResponse}
          />
        </>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default WorkflowResponse;
