import React, { useState } from "react";
import { useSystemRole } from "../hooks/useSystemRole";
import SystemRoleList from "./roles/SystemRoleList";
import { Button, Empty, notification } from "antd";
import AddSystemRole from "./roles/AddSystemRole";
import "./role.css";

const SystemRolePage = () => {
  const { errorMessage, systemRolePrompts, saveSystemRolePrompt } = useSystemRole();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  React.useEffect(() => {
    if (errorMessage) {
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  }, [errorMessage]);

  if (errorMessage) {
    return <Empty description="No System Roles available" />;
  }

  return (
    <div className="system__roles" style={{
      height:"100%",
      width:"100%",
      overflowY:"auto",
      padding:"10px"
    }}>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        + Add System Role
      </Button>
      <SystemRoleList systemRolePrompts={systemRolePrompts} />
      <AddSystemRole
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        saveSystemRolePrompt={saveSystemRolePrompt}
      />
    </div>
  );
};

export default SystemRolePage;
