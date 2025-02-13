import { useState } from "react";
import { useTools } from "../hooks/useTools";
import React from "react";
import {
  Button,
  Empty,
  notification,
} from "antd";
import ToolList from "./tools/ToolItem";
import AddTool from "./tools/AddTool";

const ToolPage = () => {
  const { tools, errorMessage, saveTool } = useTools();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  if (errorMessage) {
    return <Empty description="No tools available" />;
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        + Add Tool
      </Button>
      <ToolList tools={tools} updateTool={saveTool} />
      <AddTool
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        saveTool={saveTool}
      />
    </div>
  );
};

export default ToolPage;
