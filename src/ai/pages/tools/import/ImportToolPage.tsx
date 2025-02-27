import React, { useState } from "react";
import { Upload, Button, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Parameter, Tool } from "../../../components/types/tool";

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

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        try {
          const swaggerJson = JSON.parse(reader.result.toString());
            const host = swaggerJson.host||'localhost:8080';
            const basePath = swaggerJson.basePath || "/v1";
            const schema = swaggerJson.schemes?.find((s: string) =>s==="http")||"http";
            const hostPath = `${schema}://${host}${basePath}`

          const newTools = Object.keys(swaggerJson.paths).map((path, index) => {
            const pathItem = swaggerJson.paths[path];
            if(!Object.keys(pathItem).includes("get")){
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
              url: `${hostPath}${path}`,
              body: getBodyParams(operation.parameters)||[],
              query: getQueryParams(operation.parameters)||[]
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
    saveImport(tools);
    setIsModalVisible(false);
    setTools([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTools([]);
  };

  return (
    <Modal
      title="Add New Tool"
      visible={isModalVisible}
      onOk={handleAddTool}
      onCancel={handleCancel}
      width={800}
    >
      <div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Swagger JSON</Button>
        </Upload>
        <div>
          {tools.map((tool) => (
            <div key={tool.id}>
              <pre>{JSON.stringify(tool,undefined,2)}</pre>
              <h3>{tool.toolName}</h3>
              <p>{tool.function.description}</p>
              <ul>
                {tool.function.parameters.map((param) => (
                  <li key={param.name}>
                    <strong>{param.name}</strong> ({param.type}):{" "}
                    {param.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ImportToolPage;
function getParameters(parameters: any): Parameter[] {
  return parameters?.map((p: any) => {
    let typeValue = p['type'];
    let enumValue = p["enum"];
    if(typeValue === 'array'){
        const items = p['items'];
        if(items){
            typeValue = items.type+'[]';
            if(items.enum){
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
    } as Parameter;
  })||[];
}

function getQueryParams (parameters: any):string[]{
    return parameters?.map((p: any) => {
        if(p.in && p.in ==="query"){
            return p.name;
        }
    }).filter((p: string | undefined) => p)||[];
}

function getBodyParams (parameters: any):string[]{
    return parameters?.map((p: any) => {
        if(p.in && p.in ==="body"){
            return p.name;
        }
    }).filter((p: string | undefined) => p)||[];
}