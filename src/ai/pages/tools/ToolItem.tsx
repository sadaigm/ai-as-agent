import React, { useState } from "react";
import { Card, Row, Col, Button, Space, Modal } from "antd";
import "./toolitem.css";
import EditTool from "./EditTool";
import {EditOutlined, DeleteOutlined, FunctionOutlined, ApiOutlined } from "@ant-design/icons"; 

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
  apiPath?: string;
  environmentId?: string;
  bodyType?: 'JSON'|'STRING'|'FORM';
}

interface ToolItemProps {
  tool: Tool;
  onEdit: () => void;
  onDelete: () => void;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool, onEdit, onDelete }) => {
  return (
    <Card
      className="tool__item"
      title={<span>
        { tool.type !== 'rest' ? <FunctionOutlined style={{color:"#ff5722"}} /> : <ApiOutlined  style={{color:"#2196f3"}}/>}
       <strong style={{
        textTransform: "capitalize",
       }} > {`${tool.function.name}`}</strong>
      </span>}
      style={{
        marginBottom: "16px",
        height: "350px",
        //  width:'350px'
      }}
      extra={<Space>
        <Button icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: 'Are you sure you want to delete this tool?',
              onOk: onDelete,
            });
          }}
        >
          Delete
        </Button>
      </Space>
    }
    >
      {tool.type === 'rest' && <p>
        <strong>{tool.method} :</strong> <>{`${tool.url}${tool.apiPath}`}</>
      </p>}
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
  deleteTool: (id: string) => void;
};

const ToolList: React.FC<ToolListProps> = ({ tools, updateTool, deleteTool }) => {
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

  const handleDelete = (id: string) => {
    deleteTool(id);
  };

  return (
    <div>
      <Row gutter={16}>
        {tools.map((tool) => (
          <Col span={8} key={tool.function.name}>
            <ToolItem tool={tool} onEdit={() => handleEdit(tool)} onDelete={() => handleDelete(tool.id)} />
          </Col>
        ))}
      </Row>
      {selectedTool && isEditModalVisible && (
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
