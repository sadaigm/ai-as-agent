import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Collapse, theme } from "antd";
import {
  ApiOutlined,
  CaretRightOutlined,
  FunctionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AIAgent, Tool } from "../../components/types/tool";
import { getRandomColor } from "../../utils/ui-utils";
import { getTools } from "../../utils/service";
import "./agentlist.css";

const sampleAgents: AIAgent[] = [
  {
    name: "Inventory Associate",
    description: "Inventory Associate AI",
    systemPrompt:
      "Inventory Associate with over 5 years of experience in the retail industry. Skilled in managing inventory, monitoring shipments, and stocking shelves. Excels in communication, organization, and problem-solving.",
    model: "llama-3.2-3b-instruct",
    temperature: 0.5,
    stream: false,
    tools: ["lb202y72z", "snb3nhmki"],
  },
];

const ToolList = getTools();

const AiAgentList: React.FC = () => {
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);

  useEffect(() => {
    ToolList.then((data) => {
      setAvailableTools(data);
    });
  }, []);
  return (
    <Row gutter={16}>
      {sampleAgents.map((agent, index) => (
        <Col span={12} key={index}>
          {/* {getAgent(agent, availableTools)} */}
          <Card
            style={{
              marginBottom: "16px",
              height: "450px",
              //  width:'350px'
            }}
            className="ai__agent-list"
            title={
              <>
                <span>
                  <UserOutlined
                    style={{ color: getRandomColor() || "#2196f3" }}
                  />
                  <strong
                    style={{
                      textTransform: "capitalize",
                      marginLeft: "8px",
                    }}
                  >
                    {`${agent.name}`}
                  </strong>
                </span>
              </>
            }
          >
            {getAgent(agent, availableTools)}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AiAgentList;

function getAgent(agent: AIAgent, availableTools: Tool[]) {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const agentTools = availableTools.filter((tool) =>
    agent.tools?.includes(tool.id)
  );

  const getItems = () => {
    return agentTools.map((tool, index) => {
      return {
        key: `${index}`,
        label: (
          <>
            {
              <span>
                {tool.type !== "rest" ? (
                  <FunctionOutlined style={{ color: "#ff5722" }} />
                ) : (
                  <ApiOutlined style={{ color: "#2196f3" }} />
                )}
                <strong
                  style={{
                    textTransform: "capitalize",
                    marginLeft: "5px",
                  }}
                >
                  {`${tool.function.name}`}
                </strong>
              </span>
            }
          </>
        ),
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

  return (
    <Descriptions bordered>
      <Descriptions.Item span={3} label="Description">
        {agent.description}
      </Descriptions.Item>
      <Descriptions.Item span={3} label="SystemPrompt">
        {agent.systemPrompt}
      </Descriptions.Item>
      <Descriptions.Item label="Model">{agent.model}</Descriptions.Item>
      <Descriptions.Item label="temperature">
        {`${agent.temperature}`}
      </Descriptions.Item>
      <Descriptions.Item label="Stream">
        {agent.stream ? "Yes" : "No"}
      </Descriptions.Item>
      <Descriptions.Item label="Tools">
        <>
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ background: token.colorBgContainer }}
            items={getItems()}
          />
        </>
      </Descriptions.Item>
    </Descriptions>
  );
}
