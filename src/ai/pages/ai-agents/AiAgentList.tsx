import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Collapse, theme, Button } from "antd";
import {
  ApiOutlined,
  CaretRightOutlined,
  FunctionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AIAgent, Tool } from "../../components/types/tool";
import { getRandomColor } from "../../utils/ui-utils";
import { getTools } from "../../utils/service";
import { useAgents } from "../../hooks/useAgents";
import AddEditAiAgentModal from "./AddEditAiAgentModal";
import "./agentlist.css";
import GetAgent from "./GetAgent";

const AiAgentList: React.FC = () => {
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const { agents, saveAgent, deleteAgent } = useAgents();

  useEffect(() => {
    getTools().then((data) => {
      setAvailableTools(data);
    });
  }, []);

  const handleAdd = () => {
    setEditingAgent(null);
    setIsModalVisible(true);
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
    setIsModalVisible(true);
  };

  const handleSave = (agent: AIAgent) => {
    saveAgent(agent);
  };

  const handleDelete = (name: string) => {
    deleteAgent(name);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: "16px" }}>
        Add AI Agent
      </Button>
      <Row gutter={16}>
        {agents.map((agent, index) => (
          <Col span={12} key={index}>
            <Card
              style={{
                marginBottom: "16px",
                height: "450px",
              }}
              className="ai__agent-list"
              title={
                <>
                  <span>
                    <UserOutlined style={{ color: getRandomColor() || "#2196f3" }} />
                    <strong style={{ textTransform: "capitalize", marginLeft: "8px" }}>
                      {`${agent.name}`}
                    </strong>
                  </span>
                </>
              }
              extra={
                <>
                  <Button onClick={() => handleEdit(agent)}>Edit</Button>
                  <Button onClick={() => handleDelete(agent.name)} style={{ marginLeft: "8px" }}>
                    Delete
                  </Button>
                </>
              }
            >
              <GetAgent agent={agent} availableTools={availableTools} />
            </Card>
          </Col>
        ))}
      </Row>
      <AddEditAiAgentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
        agent={editingAgent}
        availableTools={availableTools}
      />
    </div>
  );
};

export default AiAgentList;


