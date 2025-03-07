import React, { useState } from "react";
import { useSystemRole } from "../hooks/useSystemRole";
import SystemRoleList from "./roles/SystemRoleList";
import { Button, Empty, notification } from "antd";
import AddSystemRole from "./roles/AddSystemRole";
import { SystemRolePrompt } from "../components/types/tool";
import "./role.css";
import { UserAddOutlined } from "@ant-design/icons";

const SystemRolePage = () => {
  const {
    errorMessage,
    systemRolePrompts,
    saveSystemRolePrompt,
    deleteSystemRolePrompt,
  } = useSystemRole();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRolePrompt | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (role: SystemRolePrompt) => {
    setEditingRole(role);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteSystemRolePrompt(id);
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
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ height: "50px" }}>
        {" "}
        <Button
          // type="primary"
          onClick={showModal}
          style={{ marginBottom: "16px" }}
          icon={<UserAddOutlined />}
        >
          Add Role
        </Button>
      </div>
      <div
        className="system__roles"
        style={{
          height: "calc(100% - 50px)",
          width: "100%",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <SystemRoleList
          systemRolePrompts={systemRolePrompts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AddSystemRole
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          saveSystemRolePrompt={saveSystemRolePrompt}
          editingRole={editingRole}
          setEditingRole={setEditingRole}
        />
      </div>
    </div>
  );
};

export default SystemRolePage;
