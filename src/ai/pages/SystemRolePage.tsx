import React, { useEffect, useState } from "react";
import { useSystemRole } from "../hooks/useSystemRole";
import SystemRoleList from "./roles/SystemRoleList";
import { Button, Empty, Input, notification } from "antd";
import AddSystemRole from "./roles/AddSystemRole";
import { SystemRolePrompt } from "../components/types/tool";
import "./role.css";
import { UserAddOutlined } from "@ant-design/icons";

const { Search } = Input;

const SystemRolePage = () => {
  const {
    errorMessage,
    systemRolePrompts,
    saveSystemRolePrompt,
    deleteSystemRolePrompt,
  } = useSystemRole();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRolePrompt | null>(null);
  const [filtered, setFiltered] = useState(systemRolePrompts);
  
    useEffect(() => {
      setFiltered(systemRolePrompts);
    },[systemRolePrompts])
  

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

    const onSearch = (value: string) => {
    console.log(value);
    if (value === "") {
      setFiltered(systemRolePrompts);
      return;
    }
    if (value.length > 2) {
      const filteredAgents = systemRolePrompts.filter((systemRolePrompt) => {
        return systemRolePrompt.systemRole.toLowerCase().includes(value.toLowerCase());
      });
      setFiltered(filteredAgents);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ height: "50px",  display: "flex", padding: "10px", justifyContent: "space-between" }}>
        {" "}
       <div>
         <Button
          // type="primary"
          onClick={showModal}
          style={{ marginBottom: "16px" }}
          icon={<UserAddOutlined />}
        >
          Add Role
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
        className="system__roles"
        style={{
          height: "calc(100% - 50px)",
          width: "100%",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        <SystemRoleList
          systemRolePrompts={filtered}
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
