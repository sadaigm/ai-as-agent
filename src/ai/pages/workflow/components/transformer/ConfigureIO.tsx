import React, { FC, useState } from "react";
import { Modal, Input, Button, Space } from "antd";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import {NodeParams } from "../../workflow.types";
import { AIAgent } from "../../../../components/types/tool";
import { Tool } from "../../../tools/ToolItem";
import { get } from "../../../../services/data-services";

type ConfigureIOProps = {
   data: AIAgent| Tool|string;
  nodeType: string;
  nodeId: string;
  nodeParams: NodeParams;
  onUpdateNodeData: (updatedNodeData: NodeParams) => void;
};

const ConfigureIO: FC<ConfigureIOProps> = ({
  nodeType,
  nodeId,
  data,
  nodeParams,
  onUpdateNodeData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localNodeData, setLocalNodeData] = useState<NodeParams>(nodeParams);
  const [title, settitle] = useState(getNodeTitle(nodeType, data));



  const handleSave = () => {
    onUpdateNodeData(localNodeData); // Pass updated data back to the parent
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      <Button
        size="small"
        type="default"
        onClick={() => setIsModalVisible(true)}
        style={{  fontSize: "12px", marginTop: "5px", marginLeft: "5px" }}
        icon={<SettingOutlined style={{ color: "#FF9800"}} />}
      >
        Configure
      </Button>
      <Modal
       className="configure-node fullmodel"
        title={`Configure ${nodeType} : ${title}`}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        {nodeType === "agentNode" && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <h3>Configure Agent Parameters</h3>
            <div>
              <label>Input</label>
              <Input
                value={localNodeData.input?.userPrompt || ""}
                onChange={(e) =>
                  setLocalNodeData(prev => {
                    return {
                      ...(prev as any),
                    input: { ...localNodeData.input, userPrompt: e.target.value },}
                  })
                }
              />
            </div>
            <div>
              <label>Output</label>
              <Input
                value={localNodeData.output?.response || ""}
                onChange={(e) =>
                  setLocalNodeData(prev => {
                    return {
                      ...(prev as any),
                    output: { ...localNodeData.output, response: e.target.value },
                    }
                  })
                }
              />
            </div>
          </Space>
        )}
        {nodeType === "toolNode" && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <h3>Configure Tool Parameters</h3>
            <div>
              <label>Tool Input</label>
              <Input
                value={localNodeData.input?.toolInput || ""}
                onChange={(e) =>
                  setLocalNodeData(prev => {
                    return {
                      ...(prev as any),
                    input: { ...localNodeData.input, toolInput: e.target.value },
                    }
                  })
                }
              />
            </div>
            <div>
              <label>Tool Output</label>
              <Input
                value={localNodeData.output?.toolOutput || ""}
                onChange={(e) =>
                  setLocalNodeData(prev => {
                    return {
                      ...(prev as any),
                    output: { ...localNodeData.output, toolOutput: e.target.value },
                    }
                  })
                }
              />
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default ConfigureIO;

function getNodeTitle(nodeType: string, data: string | AIAgent | Tool): any {
  if (nodeType === "agentNode") {
    return (data as AIAgent).name || "Agent Node";
  } else if (nodeType === "toolNode") {
    return (data as Tool).function.name || "Tool Node";
  }
  return "Node";
  
}
