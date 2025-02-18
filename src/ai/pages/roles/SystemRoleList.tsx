import React from "react";
import { Card, Row, Col } from "antd";
import { SystemRolePrompt } from "../../components/types/tool";

interface SystemRolePromptCardProps {
  systemRolePrompt: SystemRolePrompt;
}

const SystemRolePromptCard: React.FC<SystemRolePromptCardProps> = ({
  systemRolePrompt,
}) => {
  return (
    <Card
      title={`Role: ${systemRolePrompt.systemRole}`}
      style={{ marginBottom: "16px" }}
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
}

const SystemRoleList: React.FC<SystemRolePromptGridProps> = ({
  systemRolePrompts,
}) => {
  return (
    <Row gutter={16}>
      {systemRolePrompts.map((prompt) => (
        <Col span={8} key={prompt.id}>
          <SystemRolePromptCard systemRolePrompt={prompt} />
        </Col>
      ))}
    </Row>
  );
};

export default SystemRoleList;
