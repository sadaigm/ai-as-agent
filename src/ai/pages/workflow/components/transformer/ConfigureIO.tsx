import React, { FC, useRef, useState } from "react";
import { Modal, Input, Button, Space, Popover, Tree, Empty } from "antd";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { NodeParams } from "../../workflow.types";
import { AIAgent } from "../../../../components/types/tool";
import { Tool } from "../../../tools/ToolItem";
import { useWorkflow } from "../WorkflowProvider";
import { getNodes } from "../../../../utils/agent-utils";

type ConfigureIOProps = {
  data: AIAgent | Tool | string;
  nodeType: string;
  nodeId: string;
  nodeParams: NodeParams;
  onUpdateNodeData: (updatedNodeData: NodeParams) => void;
  previousNodes?: any[];
};

const { TextArea } = Input;

const ConfigureIO: FC<ConfigureIOProps> = ({
  nodeType,
  nodeId,
  data,
  nodeParams,
  onUpdateNodeData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localNodeData, setLocalNodeData] = useState<NodeParams>(nodeParams);
  const [title, setTitle] = useState(getNodeTitle(nodeType, data));
  const textAreaRef = useRef<any>(null); // Ref for the TextArea to manage cursor position
  const [treeVisible, setTreeVisible] = useState(false); // State to control tree popover visibility
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // State to track selected keys in the tree
const { currentWorkflowId,  edges, nodes } = useWorkflow();
const [treeData, settreeData] = useState<any[]>([]);

  const handleSave = () => {
    onUpdateNodeData(localNodeData); // Pass updated data back to the parent
    setIsModalVisible(false); // Close the modal
  };

  const handleInsertExpression = (expression: string) => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    if (textArea) {
      const cursorPosition = textArea.selectionStart;
      const currentValue = localNodeData.input?.userPrompt || "";
      const newValue =
        currentValue.slice(0, cursorPosition) +
        expression +
        currentValue.slice(cursorPosition);
      setLocalNodeData((prev) => ({
        ...prev,
        input: { ...prev.input, userPrompt: newValue },
      }));
    }
    setTreeVisible(false); // Close the tree popover
    setSelectedKeys([]); // Reset the selected keys
  };

  function prepareConfigure(): void {
    if(currentWorkflowId === nodeId) {
      const previousNodes = getNodes(edges, currentWorkflowId);
      const treeNodes: any[] = [];
      nodes.forEach((node: any) => {
        if(previousNodes.includes(node.id)) {
          if(node.type === "agentNode") {
          treeNodes.push({
            title: node.data.data.name,
            key: node.id,
            children: [
              { title: "Input", key: "{{"+node.id+".parameters.input}}" },
              { title: "Output", key: "{{"+node.id+".parameters.output}}" },
            ],
          });
        } else if(node.type === "toolNode") {

          const paramInput = node.data.data.function.parameters.map((p: any) => {
            return {
              title: p.name,
              key: "{{"+node.id+".parameters."+p.name+"}}",
            }
          });

          treeNodes.push({
            title: node.data.data.function.name,
            key: node.id,
            children: [
              ...paramInput,
              { title: "Output", key:"{{"+node.id+".parameters.output}}" },
            ],
          });
        }
        }
      });
      console.log(previousNodes, treeNodes)
      settreeData(treeNodes);
    }
    setIsModalVisible(true);
  }

  return (
    <>
      <Button
        size="small"
        type="default"
        onClick={() => prepareConfigure()}
        style={{ fontSize: "12px", marginTop: "5px", marginLeft: "5px" }}
        icon={<SettingOutlined style={{ color: "#FF9800" }} />}
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextArea
                  ref={textAreaRef}
                  rows={4}
                  value={localNodeData.input?.userPrompt || ""}
                  onChange={(e) =>
                    setLocalNodeData((prev) => ({
                      ...prev,
                      input: { ...prev.input, userPrompt: e.target.value },
                    }))
                  }
                />
                <Popover
                  content={
                    treeData.length > 0 ? (
                    <Tree
                      treeData={treeData}
                      selectedKeys={selectedKeys} // Bind selected keys to state
                      onSelect={(keys) => {
                        if (keys.length > 0) {
                          handleInsertExpression(keys[0] as string);
                        }
                      }}
                    />
                    ):
                    <Empty description="No parameters available" />

                  }
                  title="Select Parameter"
                  trigger="click"
                  visible={treeVisible}
                  onVisibleChange={(visible) => {
                    setTreeVisible(visible);
                    if (visible) {
                      setSelectedKeys([]); // Reset selected keys when popover opens
                    }
                  }}
                >
                  <Button
                    size="small"
                    style={{ marginLeft: "8px" }}
                    icon={<CheckOutlined />}
                  >
                    Pick
                  </Button>
                </Popover>
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
        )}
        {nodeType === "toolNode" && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <h3>Configure Tool Parameters</h3>
            <div>
              <label>Tool Input</label>
              <Input
                value={localNodeData.input?.toolInput || ""}
                onChange={(e) =>
                  setLocalNodeData((prev) => ({
                    ...prev,
                    input: { ...prev.input, toolInput: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label>Tool Output</label>
              <Input
                value={localNodeData.output?.toolOutput || ""}
                onChange={(e) =>
                  setLocalNodeData((prev) => ({
                    ...prev,
                    output: { ...prev.output, toolOutput: e.target.value },
                  }))
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
