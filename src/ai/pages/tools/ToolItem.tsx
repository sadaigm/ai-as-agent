import React, { useState } from "react";
import { Card, Row, Col, Button } from "antd";
import "./toolitem.css";
import EditTool from "./EditTool";
import {EditOutlined} from "@ant-design/icons"; 

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  enum?: string[];
}

export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Parameter[];
  };
  id: string;
  toolName: string;
  method?: 'GET'|'POST';
  url?: string;
  bodyType?: 'JSON'|'STRING'|'FORM';
}

interface ToolItemProps {
  tool: Tool;
  onEdit: () => void;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool, onEdit }) => {
  return (
    <Card
      className="tool__item"
      title={`Tool Name: ${tool.type}`}
      style={{
        marginBottom: "16px",
        height: "350px",
        //  width:'350px'
      }}
      extra={<Button icon={<EditOutlined />} onClick={onEdit}>Edit</Button>}
    >
      <p>
        <strong>Function Name:</strong> {tool.function.name}
      </p>
      <p>
        <strong>Description:</strong> {tool.function.description}
      </p>
      <p>
        <strong>Parameters:</strong>
      </p>
      <ul>
        {tool.function.parameters.map((param, index) => (
          <li key={index}>
            <strong>{param.name}</strong>: {param.type} - {param.description}{" "}
            {param.required ? "(Required)" : "(Optional)"}
          </li>
        ))}
      </ul>
    </Card>
  );
};

type ToolListProps = {
  tools: Tool[];
  updateTool: (updatedTool: Tool) => void;
};

const ToolList: React.FC<ToolListProps> = ({ tools, updateTool }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const handleEdit = (tool: Tool) => {
        setSelectedTool(tool);
        setIsEditModalVisible(true);
      };
    
      const handleUpdateTool = (updatedTool: Tool) => {
        updateTool(updatedTool);
        setIsEditModalVisible(false);
        setSelectedTool(null);
      };
  return (
    <div>
    <Row gutter={16}>
      {tools.map((tool) => (
        <Col span={8} key={tool.function.name}>
           <ToolItem tool={tool} onEdit={() => handleEdit(tool)} />
        </Col>
      ))}
    </Row>
    {selectedTool && (
        <EditTool
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          tool={selectedTool}
          updateTool={handleUpdateTool}
        />
      )}
      </div>
  );
};

export default ToolList;
