import { List, Button, Input, Modal, message } from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getFuncParamsString } from "../../utils/function";
import { Tool } from "../types/tool";
import { getTools } from "../../utils/service";
import GetToolLabel from "../../pages/tools/ui/GetToolLabel";
import ManageToolList from "../../pages/tools/ui/ManageToolList";

type GetAIToolsProps = {
  onChange: (tools: Tool[]) => void;
  removeTool?: (tool: Tool) => void;
  handleAddTool?: (tool: Tool | null) => void;
  defaultValue?: Tool[];
};
const ToolList = getTools();

const GetAITools: FC<GetAIToolsProps> = ({
  removeTool,
  handleAddTool,
  onChange,
  defaultValue,
}) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);

  useEffect(() => {
    defaultValue && setTools(defaultValue);
  }, [defaultValue]);

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setIsModalVisible(true);
  };
  const handleRemove = (tool: Tool) => {
    const updatedTools = tools.filter(
      (t) => t.function.name !== tool.function.name
    );
    console.log({updatedTools})
    removeTool && removeTool(tool);
    setTools(updatedTools);
    onChange(updatedTools);
    console.log(
      { tool },
      `${tool.type}:${tool.function.name} removed from tools list`
    );
    message.info(`${tool.type}:${tool.function.name} removed from tools list`);
  };
  const handleAdd = () => {
    if (selectedTool) {
      const updatedTools = [...tools, selectedTool];
      console.log({updatedTools})
      handleAddTool && handleAddTool(selectedTool);
      setTools(updatedTools);
      onChange(updatedTools);
      console.log(
        { selectedTool },
        `${selectedTool.type}:${selectedTool.function.name} added to tools list`
      );
      message.success(
        `${selectedTool.type}:${selectedTool.function.name} added to tools list`
      );
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    ToolList.then((data) => {
      setAvailableTools(data);
      setAllTools(data);
    });
  }, []);
  return (
    <div>
      <Input
        placeholder="Search tools"
        prefix={<SearchOutlined />}
        onChange={(e) => {
          console.log(e.target.value);
          if (e.target.value) {
            const filtered = availableTools.filter((t) =>
              getFuncParamsString(t).includes(e.target.value)
            );
            setAvailableTools(filtered);
          } else {
            setAvailableTools(allTools);
          }
        }}
        style={{ width: "100%" }}
      />
      {/* <List
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        style={{ maxHeight: "225px" }}
        dataSource={availableTools}
        bordered
        renderItem={(tool) => (
          <List.Item
            actions={[
              <Button
                disabled={
                  tools.findIndex(
                    (t) => t.function.name === tool.function.name
                  ) > -1
                }
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => handleToolSelect(tool)}
              ></Button>,
            ]}
          >
            <GetToolLabel tool={tool} showParams />
          </List.Item>
        )}
      /> */}

        <ManageToolList  tools={availableTools} showAdd  enabledTools={tools} handleToolSelect={handleToolSelect} />

      <br />
      <ManageToolList tools={tools} showRemove handleRemove={handleRemove} />
      {/* <List
        size="small"
        bordered
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        style={{ maxHeight: "225px" }}
        dataSource={tools}
        renderItem={(tool) => (
          <List.Item
            actions={[
              <Button
                color="danger"
                variant="outlined"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleRemove(tool)}
              ></Button>,
            ]}
          >
            <GetToolLabel tool={tool} showParams />
          </List.Item>
        )}
      /> */}
      <Modal
        title="Add Tool"
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
        okText="Add Tool"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to add{" "}
          <strong>{selectedTool?.function.name}</strong> to the current form?
        </p>
      </Modal>
    </div>
  );
};

export default GetAITools;
