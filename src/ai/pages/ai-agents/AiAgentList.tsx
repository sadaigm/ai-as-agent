import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Descriptions,
  Collapse,
  theme,
  Button,
  Input,
} from "antd";
import {
  ApiOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FunctionOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AIAgent, Tool } from "../../components/types/tool";
import { getRandomColor } from "../../utils/ui-utils";
import { getTools } from "../../utils/service";
import { useAgents } from "../../hooks/useAgents";
import AddEditAiAgentModal from "./AddEditAiAgentModal";
import "./agentlist.css";
import GetAgent from "./GetAgent";
import useScreenSize from "../../hooks/useScreenSize";

const { Search } = Input;
const AiAgentList: React.FC = () => {
  const { screenSize } = useScreenSize();
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const { agents, saveAgent, deleteAgent } = useAgents();

  const [filtered, setFiltered] = useState(agents);

  useEffect(() => {
    setFiltered(agents);
  },[agents])

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

  const onSearch = (value: string) => {
    console.log(value);
    if (value === "") {
      setFiltered(agents);
      return;
    }
    if (value.length > 2) {
      const filteredAgents = agents.filter((agent) => {
        return agent.name.toLowerCase().includes(value.toLowerCase());
      });
      setFiltered(filteredAgents);
    }
  };

  const isNonMobileTablet = screenSize !== "mobile" && screenSize !== "tablet";
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ height: "50px", display: "flex", padding: "10px", justifyContent: "space-between" }}>
        <div>
          <Button
          icon={<UserAddOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: "16px" }}
        >
          New AI Agent
        </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexDirection:"row" }}>
          <div  style={{ width: "70px"}}>
            <span > Total: {filtered.length}</span>
          </div>
          <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="middle"
          onSearch={onSearch}
        />
        </div>
      </div>
      <div
        className="aiagents__list"
        style={{
          height: "calc(100% - 50px)",
          width: "100%",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <Row>
          {filtered.map((agent, index) => (
            <Col xs={{ flex: "100%" }} key={index}>
              <Card
                style={{
                  marginBottom: "16px",
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
                extra={
                  <>
                    <Button
                      size={isNonMobileTablet ? "large" : "small"}
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(agent)}
                    >
                      {`${isNonMobileTablet ? "Edit" : ""}`}
                    </Button>
                    <Button
                      size={isNonMobileTablet ? "large" : "small"}
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(agent.name)}
                      style={{ marginLeft: "8px" }}
                    >
                      {`${isNonMobileTablet ? "Delete" : ""}`}
                    </Button>
                  </>
                }
              >
                <GetAgent agent={agent} availableTools={availableTools} />
              </Card>
            </Col>
          ))}
        </Row>
        {isModalVisible && (
          <AddEditAiAgentModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSave={handleSave}
            agent={editingAgent}
            availableTools={availableTools}
          />
        )}
      </div>
    </div>
  );
};

export default AiAgentList;
