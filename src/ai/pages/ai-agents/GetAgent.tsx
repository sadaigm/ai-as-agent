import { theme, Descriptions, Collapse, Avatar } from "antd";
import {
  FunctionOutlined,
  ApiOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import React, { FC } from "react";
import { AIAgent } from "../../components/types/tool";
import { Tool } from "../tools/ToolItem";
import GetToolLabel from "../tools/ui/GetToolLabel";
import ManageToolList from "../tools/ui/ManageToolList";
import useScreenSize from "../../hooks/useScreenSize";
import Meta from "antd/es/card/Meta";

type GetAgentProps = {
  agent: AIAgent;
  availableTools: Tool[];
};

const GetAgent: FC<GetAgentProps> = ({ agent, availableTools }) => {
  const { token } = theme.useToken();
  const { layout } = useScreenSize();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const agentTools = availableTools.filter((tool) =>
    agent.tools?.map((t) => t.id).includes(tool.id)
  );

  const getItems = () => {
    return agentTools.map((tool, index) => {
      return {
        key: `${index}`,
        label: <GetToolLabel tool={tool} />,
        children: (
          <p>
            <p
              style={{
                textTransform: "capitalize",
              }}
            >
              <strong>Type:</strong> <span>{tool.type}</span> {"  ("}
              {tool.type !== "rest" ? (
                <FunctionOutlined style={{ color: "#ff5722" }} />
              ) : (
                <ApiOutlined style={{ color: "#2196f3" }} />
              )}
              {") "}
            </p>
            {tool.type === "rest" && (
              <p>
                <strong>{tool.method} :</strong> {tool.url}
              </p>
            )}
            <p>
              <strong>Description:</strong> {tool.function.description}
            </p>
            <p>
              <strong>Parameters:</strong>
            </p>
            <ul>
              {tool.function.parameters.map((param, index) => (
                <li key={index}>
                  <strong>{param.name}</strong>: {param.type} -{" "}
                  {param.description}{" "}
                  {param.required ? "(Required)" : "(Optional)"}
                </li>
              ))}
            </ul>
          </p>
        ),
        style: panelStyle,
      };
    });
  };

  return layout === "horizontal" ? (
    <Descriptions
      column={{ xs: 1, sm: 1, md: 1, lg: 3 }}
      layout={layout}
      bordered
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Descriptions.Item span={3} label="Description">
        {agent.description}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="SystemPrompt">
        {agent.systemPrompt}
      </Descriptions.Item>
      <Descriptions.Item label="Model">{agent.model}</Descriptions.Item>
      <Descriptions.Item label="temperature">{`${agent.temperature}`}</Descriptions.Item>
      <Descriptions.Item label="Stream">
        {agent.stream ? "Yes" : "No"}
      </Descriptions.Item>
      <Descriptions.Item label="Tools">
        <>
          <ManageToolList tools={agentTools} pageSize={1} />
        </>
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <div style={{ height: "100%", padding:"16px", display: "flex", flexDirection: "column" }}>
      <Meta
        title={agent.name}
        description={
          <>
            <div>
              <p>
                <strong>Model:</strong> {agent.model}
              </p>
              <p>
                <strong>Description:</strong> {agent.description}
              </p>
              <p>
                <strong>System Prompt:</strong> {agent.systemPrompt}
              </p>
              <p>
                <strong>Tools:</strong>
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  style={{ background: token.colorBgContainer }}
                  items={getItems()}
                />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
};

export default GetAgent;
