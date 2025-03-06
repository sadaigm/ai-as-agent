import { theme, Descriptions, Collapse } from 'antd';
import { FunctionOutlined, ApiOutlined, CaretRightOutlined } from '@ant-design/icons';
import React, { FC } from 'react'
import { AIAgent } from '../../components/types/tool';
import { Tool } from '../tools/ToolItem';

type GetAgentProps = {
    agent: AIAgent;
     availableTools: Tool[];
}


const GetAgent: FC<GetAgentProps> = ({agent, availableTools}) => {
    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
      marginBottom: 24,
      background: token.colorFillAlter,
      borderRadius: token.borderRadiusLG,
      border: "none",
    };
  
    const agentTools = availableTools.filter((tool) =>
      agent.tools?.map(t => (t.id)).includes(tool.id)
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

export default GetAgent