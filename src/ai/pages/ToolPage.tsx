import { useState } from "react";
import { useTools } from "../hooks/useTools";
import React from "react";
import {
  Button,
  Empty,
  notification,
  Space,
} from "antd";
import {UploadOutlined, FileAddOutlined} from "@ant-design/icons"; 
import ToolList from "./tools/ToolItem";
import AddTool from "./tools/AddTool";
import ImportToolPage from "./tools/import/ImportToolPage";
import { Tool } from "../components/types/tool";
import './tools.css'

const ToolPage = () => {
  const { tools, errorMessage, saveTool, saveToolImport, deleteTool } = useTools();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportVisible, setIsImportVisible] = useState(false);

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

  return (
    <div  className="system__Tools" style={{
      height:"100%",
      width:"100%",
      overflowY:"auto",
      padding:"10px"
    }}>
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
      {isImportVisible && <ImportToolPage isModalVisible={isImportVisible}
        setIsModalVisible={setIsImportVisible}
        saveImport={saveImport} />}
      <ToolList tools={tools} updateTool={saveTool} deleteTool={deleteTool} />
      {isModalVisible && <AddTool
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        saveTool={saveTool}
      />}
    </div>
  );
};

export default ToolPage;
