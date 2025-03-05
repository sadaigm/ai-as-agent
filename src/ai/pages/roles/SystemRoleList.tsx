import React from "react";
import { Card, Row, Col, Button } from "antd";
import { SystemRolePrompt } from "../../components/types/tool";
import {EditOutlined} from "@ant-design/icons"; 

interface SystemRolePromptCardProps {
  systemRolePrompt: SystemRolePrompt;
  onEdit: (systemRolePrompt: SystemRolePrompt) => void;
}

const SystemRolePromptCard: React.FC<SystemRolePromptCardProps> = ({
  systemRolePrompt,
  onEdit,
}) => {
  return (
    <Card
      title={`Role: ${systemRolePrompt.systemRole}`}
      style={{ marginBottom: "16px" }}
      extra={<Button icon={<EditOutlined />} onClick={() => onEdit(systemRolePrompt)}>Edit</Button>}
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
}

const SystemRoleList: React.FC<SystemRolePromptGridProps> = ({
  systemRolePrompts,
  onEdit,
}) => {
  return (
    <Row gutter={16}>
      {systemRolePrompts.map((prompt) => (
        <Col span={8} key={prompt.id}>
          <SystemRolePromptCard systemRolePrompt={prompt} onEdit={onEdit} />
        </Col>
      ))}
    </Row>
  );
};

export default SystemRoleList;
