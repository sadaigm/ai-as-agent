import React from "react";
import { Card, Row, Col, Button, Modal } from "antd";
import { SystemRolePrompt } from "../../components/types/tool";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { getRandomColor } from "../../utils/ui-utils";

interface SystemRolePromptCardProps {
  systemRolePrompt: SystemRolePrompt;
  onEdit: (systemRolePrompt: SystemRolePrompt) => void;
  onDelete: (id: string) => void;
}

const SystemRolePromptCard: React.FC<SystemRolePromptCardProps> = ({
  systemRolePrompt,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      title={<span>
        <UserOutlined style={{color: getRandomColor()||"#2196f3"}} />
        <strong style={{
          textTransform: "capitalize",
          marginLeft: "8px",
        }} >
          {`${systemRolePrompt.systemRole}`}
        </strong>
      </span>}
      style={{ marginBottom: "16px" }}
      extra={
        <>
          <Button icon={<EditOutlined />} onClick={() => onEdit(systemRolePrompt)}>Edit</Button>
            <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
              title: "Are you sure you want to delete this role?",
              onOk: () => onDelete(systemRolePrompt.id),
              });
            }}
            style={{ marginLeft: "8px" }}
            >
            Delete
            </Button>
        </>
      }
    >
      <div>
        <p>
          <strong>ID:</strong> {systemRolePrompt.id}
        </p>
        <p>
          <strong>Prompt:</strong> {systemRolePrompt.systemPrompt}
        </p>
      </div>
    </Card>
  );
};

interface SystemRolePromptGridProps {
  systemRolePrompts: SystemRolePrompt[];
  onEdit: (systemRolePrompt: SystemRolePrompt) => void;
  onDelete: (id: string) => void;
}

const SystemRoleList: React.FC<SystemRolePromptGridProps> = ({
  systemRolePrompts,
  onEdit,
  onDelete,
}) => {
  return (
    <Row gutter={16}>
      {systemRolePrompts.map((prompt) => (
        <Col xs={24} sm={12} md={8} key={prompt.id}>
          <SystemRolePromptCard systemRolePrompt={prompt} onEdit={onEdit} onDelete={onDelete} />
        </Col>
      ))}
    </Row>
  );
};

export default SystemRoleList;
