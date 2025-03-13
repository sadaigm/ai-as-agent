import React, { useState } from "react";
import { Upload, Button, message, Modal, List, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Tool } from "../../../components/types/tool";
import "./import-tool.css";

type ImportToolProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  saveImport: (tool: Tool[]) => void;
};

const ImportToolPage: React.FC<ImportToolProps> = ({
  isModalVisible,
  setIsModalVisible,
  saveImport,
}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        try {
          const swaggerJson = JSON.parse(reader.result.toString());
          const host = swaggerJson.host || 'localhost:8080';
          const basePath = swaggerJson.basePath || "/v1";
          const schema = swaggerJson.schemes?.find((s: string) => s === "http") || "http";
          const hostPath = `${schema}://${host}`;

          const newTools = Object.keys(swaggerJson.paths).map((path) => {
            const pathItem = swaggerJson.paths[path];
            if (!Object.keys(pathItem).includes("get")) {
              return;
            }
            const method = 'get';
            const operation = pathItem[method];
            return {
              type: "rest",
              function: {
                name: operation.summary,
                description: operation.description,
                parameters: getParameters(operation.parameters) || [],
              },
              id: Math.random().toString(36).substr(2, 9),
              toolName: operation.summary,
              method: method.toUpperCase() as "GET" | "POST",
              url: `${hostPath}`,
              apiPath: `${basePath}${path}`.replace("//", "/"),
              environmentId: undefined,
              body: getBodyParams(operation.parameters) || [],
              query: getQueryParams(operation.parameters) || []
            } as Tool;
          }).filter(v => v) as Tool[];
          setTools(newTools);
          message.success("Tools imported successfully");
        } catch (error) {
          console.log(error);
          message.error("Failed to parse Swagger JSON");
        }
      }
    };
    reader.readAsText(file);
    return false;
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  const handleAddTool = () => {
    const selectedToolsArray = tools.filter(tool => selectedTools.has(tool.id));
    saveImport(selectedToolsArray);
    setIsModalVisible(false);
    setTools([]);
    setSelectedTools(new Set());
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTools([]);
    setSelectedTools(new Set());
  };

  const handleToolSelection = (toolId: string, checked: boolean) => {
    const updatedSelectedTools = new Set(selectedTools);
    if (checked) {
      updatedSelectedTools.add(toolId);
    } else {
      updatedSelectedTools.delete(toolId);
    }
    setSelectedTools(updatedSelectedTools);
  };

  return (
    <Modal
      className="import-tool-modal"
      title="Add New Tool"
      visible={isModalVisible}
      onOk={handleAddTool}
      onCancel={handleCancel}
      width="90%"
      style={{ top: 0, height: 'calc(100vh - 125px)' }}
      bodyStyle={{ padding: '0px', height: 'calc(100vh - 120px)' }}
    >
      <div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Swagger JSON</Button>
        </Upload>
        <List
          className="tool-list"
          dataSource={tools}
          renderItem={(tool) => (
            <List.Item>
              <Checkbox
                checked={selectedTools.has(tool.id)}
                onChange={(e) => handleToolSelection(tool.id, e.target.checked)}
              >
                <List.Item.Meta
                  title={<a href={`${tool.url}${tool.apiPath}`}>{tool.toolName}</a>}
                  description={
                    <>
                      <p>{tool.url}</p>
                      <p>{tool.apiPath}</p>
                      <p>{tool.function.description}</p>
                    </>
                  }
                />
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ImportToolPage;

function getParameters(parameters: any) {
  return parameters?.map((p: any) => {
    let typeValue = p['type'];
    let enumValue = p["enum"];
    if (typeValue === 'array') {
      const items = p['items'];
      if (items) {
        typeValue = items.type + '[]';
        if (items.enum) {
          enumValue = items.enum;
        }
      }
    }

    return {
      name: p["name"],
      description: p["description"],
      type: typeValue,
      enum: enumValue,
      required: p["required"],
    };
  }) || [];
}

function getQueryParams(parameters: any) {
  return parameters?.map((p: any) => {
    if (p.in && p.in === "query") {
      return p.name;
    }
  }).filter((p: string | undefined) => p) || [];
}

function getBodyParams(parameters: any) {
  return parameters?.map((p: any) => {
    if (p.in && p.in === "body") {
      return p.name;
    }
  }).filter((p: string | undefined) => p) || [];
}
