import { Space, Input } from "antd";
import { FC, useEffect, useState } from "react";
import { ConfigureIOProps } from "./ConfigureIO";
import { NodeParams } from "../../workflow.types";
import ExpressionField from "./ExpressionField";

type AgentParameterProps = ConfigureIOProps & {
  treeData: any[];
};

const ConfigureAgent: FC<AgentParameterProps> = ({
  nodeType,
  nodeId,
  data,
  nodeParams,
  onUpdateNodeData,
  treeData,
}) => {
  const [localNodeData, setLocalNodeData] = useState<NodeParams>(nodeParams);
  useEffect(() => {
    // Update the parent node data whenever parameters or body change
    onUpdateNodeData({
      ...nodeParams,
      input: {
        ...localNodeData.input,
      },
    });
  }, [localNodeData]);

  const handleUpdateNodeData = (updatedNodeData: NodeParams) => {
    setLocalNodeData(updatedNodeData);
  };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h3>Configure Agent Parameters</h3>
      <div>
        <label>Input</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ExpressionField
            nodeType={nodeType}
            nodeId={nodeId}
            data={data}
            nodeParams={nodeParams}
            onUpdateNodeData={handleUpdateNodeData}
            treeData={treeData}
            fieldKey={"userPrompt"}
          />
        </div>
      </div>
      <div>
        <label>Output</label>
        <Input
          value={localNodeData.output?.response || ""}
          onChange={(e) =>
            setLocalNodeData((prev) => ({
              ...prev,
              output: { ...prev.output, response: e.target.value },
            }))
          }
        />
      </div>
    </Space>
  );
};

export default ConfigureAgent;
