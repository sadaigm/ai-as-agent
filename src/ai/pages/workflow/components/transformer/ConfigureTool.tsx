import { Space, Input, Form } from "antd";
import { FC, useEffect, useState } from "react";
import { ConfigureIOProps } from "./ConfigureIO";
import { Tool } from "../../../tools/ToolItem";
import ExpressionField from "./ExpressionField";
import { NodeParams } from "../../workflow.types";

const { TextArea } = Input;
type ToolParameter = ConfigureIOProps & {
  treeData: any[];
};

const ConfigureTool: FC<ToolParameter> = ({
  nodeType,
  nodeId,
  data,
  nodeParams,
  onUpdateNodeData,
  treeData,
}) => {
  const tool: Tool = data as Tool;
  const [localNodeData, setLocalNodeData] = useState<NodeParams>(nodeParams);
  const [body, setBody] = useState<string>(nodeParams?.input?.body || "");

  useEffect(() => {
    // Update the parent node data whenever parameters or body change
    onUpdateNodeData({
      ...nodeParams,
      input: {
        ...localNodeData.input,
        body: tool.method === "POST" ? body : undefined,
      },
    });
  }, [localNodeData, body]);

  const handleUpdateNodeData = (updatedNodeData: NodeParams) => {
    setLocalNodeData(updatedNodeData);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h3>Configure Tool Parameters</h3>
      <h4>Tool Type: {tool.type}</h4>
      <h4>Method: {tool.method}</h4>
      <h4>URL: {(tool.url || "") + tool.apiPath}</h4>

      <Form layout="vertical">
        {tool.function.parameters.map((param) => (
          <Form.Item
            key={param.name}
            label={`${param.name} (${param.type})`}
            tooltip={param.description}
            required={param.required}
          >
            <ExpressionField
              nodeType={nodeType}
              nodeId={nodeId}
              data={data}
              nodeParams={nodeParams}
              onUpdateNodeData={handleUpdateNodeData}
              treeData={treeData}
              fieldKey={param.name}
            />
            {/* <Input
              placeholder={`Enter ${param.name}`}
              value={parameters[param.name] || ""}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
            /> */}
          </Form.Item>
        ))}

        {tool.method === "POST" && (
          <Form.Item label="Request Body">
            <TextArea
              rows={4}
              placeholder="Enter request body as JSON"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Form.Item>
        )}
      </Form>
    </Space>
  );
};

export default ConfigureTool;
