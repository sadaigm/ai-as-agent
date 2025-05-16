import { useEffect, useState } from "react";
import { useTools } from "../hooks/useTools";
import React from "react";
import {
  Button,
  Empty,
  Input,
  notification,
  Space,
} from "antd";
import {UploadOutlined, FileAddOutlined} from "@ant-design/icons"; 
import ToolList from "./tools/ToolItem";
import AddTool from "./tools/AddTool";
import ImportToolPage from "./tools/import/ImportToolPage";
import { Tool } from "../components/types/tool";
import './tools.css'

const { Search } = Input;

const ToolPage = () => {
  const { tools, errorMessage, saveTool, saveToolImport, deleteTool } = useTools();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportVisible, setIsImportVisible] = useState(false);
  const [filtered, setFiltered] = useState(tools);
    
      useEffect(() => {
        setFiltered(tools);
      },[tools])
    

  React.useEffect(() => {
    if (errorMessage) {
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  }, [errorMessage]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const saveImport = (tools:Tool[]) =>{
    console.log(tools);
    saveToolImport(tools);
  }
  const showImport = () => {
    setIsImportVisible(true);
  };

  if (errorMessage) {
    return <Empty description="No tools available" />;
  }
      const onSearch = (value: string) => {
    console.log(value);
    if (value === "") {
      setFiltered(tools);
      return;
    }
    if (value.length > 2) {
      const filteredAgents = tools.filter((tool) => {
        return tool.toolName.toLowerCase().includes(value.toLowerCase());
      });
      setFiltered(filteredAgents);
    }
  };

  return (
    <div  className="system__Tools" style={{
      height:"100%",
      width:"100%",
      overflowY:"auto",
      padding:"10px"
    }}>
      <div style={{ height: "50px",  display: "flex", padding: "10px", justifyContent: "space-between" }}>

      
     <div>
      <Space>
     <Button
        icon={<FileAddOutlined />}
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        Add Tool
      </Button>
      <Button
        icon={<UploadOutlined />}        
        onClick={showImport}
        style={{ marginBottom: "16px" }}
      >
        Import Tools
      </Button>
     </Space>
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
      {isImportVisible && <ImportToolPage isModalVisible={isImportVisible}
        setIsModalVisible={setIsImportVisible}
        saveImport={saveImport} />}
      <ToolList tools={filtered} updateTool={saveTool} deleteTool={deleteTool} />
      {isModalVisible && <AddTool
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        saveTool={saveTool}
      />}
    </div>
  );
};

export default ToolPage;
