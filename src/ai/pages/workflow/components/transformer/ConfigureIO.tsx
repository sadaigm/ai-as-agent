import React, { FC, useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Space, Popover, Tree, Empty } from "antd";
import {
  CheckOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { NodeParams } from "../../workflow.types";
import { AIAgent } from "../../../../components/types/tool";
import { Tool } from "../../../tools/ToolItem";
import { useWorkflow } from "../WorkflowProvider";
import { getNodes } from "../../../../utils/agent-utils";
import { getRandomColor } from "../../../../utils/ui-utils";
import ConfigureTool from "./ConfigureTool";

export type ConfigureIOProps = {
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
  const { currentWorkflowId, edges, nodes } = useWorkflow();
  const [treeData, settreeData] = useState<any[]>([]);

  useEffect(() => {
    setLocalNodeData(nodeParams); // Initialize localNodeData with nodeParams
  }, [nodeParams]);

  useEffect(() => {
    const currentNode = nodes.find((node: any) => node.id === nodeId);
    console.log(currentNode,nodes,nodeId)
    if (currentNode && currentNode.params) {
      setLocalNodeData(currentNode.params);
    }// Update title based on nodeType and data
  }, [nodeId,nodes]);

  const handleSave = () => {
    onUpdateNodeData(localNodeData); // Pass updated data back to the parent
    handleClose();
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
    if (currentWorkflowId === nodeId) {
      const previousNodes = getNodes(edges, currentWorkflowId);
      const treeNodes: any[] = [];
      nodes.forEach((node: any) => {
        if (previousNodes.includes(node.id)) {
          if (node.type === "agentNode") {
            const agent = (node.data.node as AIAgent);
            treeNodes.push({
              title: agent.name,
              key: node.id,
              icon: (
                <ThunderboltOutlined
                  style={{ color: getRandomColor() || "#2196f3" }}
                />
              ),
              children: [
                { title: "Input", key: "{{" + node.id + ".input.userPrompt}}" },
                {
                  title: "Output",
                  key: "{{" + node.id + ".output.response}}",
                },
              ],
            });
          } else if (node.type === "toolNode") {
            const tool = (node.data.node as Tool)
            const paramInput = tool.function.parameters.map(
              (p: any) => {
                return {
                  title: p.name,
                  key: "{{" + node.id + ".parameters." + p.name + "}}",
                };
              }
            );

            treeNodes.push({
              title: tool.function.name,
              key: node.id,
              icon: <ToolOutlined />,
              children: [
                ...paramInput,
                {
                  title: "Output",
                  key: "{{" + node.id + ".output}}",
                },
              ],
            });
          }
        }
      });
      settreeData(treeNodes);
    }
    setIsModalVisible(true);
  }
  const handleClose = () => {
    settreeData([]);
    setIsModalVisible(false);
    setLocalNodeData({});
  };

  return (
    <>
      <Button
        size="small"
        type="dashed"
        onClick={() => prepareConfigure()}
        style={{ fontSize: "11px", }}
        icon={<SettingOutlined size={10} style={{ color: "#FF9800" }} />}
      >
        Configure
      </Button>
      {isModalVisible && (
        <Modal
          className="configure-node fullmodel"
          title={`Configure ${nodeType} : ${title}`}
          visible={isModalVisible}
          onOk={handleSave}
          onCancel={handleClose}
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
                  {treeData.length > 0 && <div style={{ width: "15%" }}>
                    <Popover
                      placement="leftTop"
                      content={
                        treeData.length > 0 ? (
                          <Tree
                            showIcon
                            treeData={treeData}
                            selectedKeys={selectedKeys} // Bind selected keys to state
                            onSelect={(keys) => {
                              if (keys.length > 0) {
                                handleInsertExpression(keys[0] as string);
                              }
                            }}
                          />
                        ) : (
                          <Empty description="No parameters available" />
                        )
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
                  </div>}
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
            // configureTool()
            <ConfigureTool
              data={data as Tool}
              nodeId={nodeId}
              nodeParams={localNodeData}
              onUpdateNodeData={(updatedNodeData) => {
                console.log("io/update")
                setLocalNodeData(updatedNodeData);                
              }}
              nodeType={nodeType}
              treeData={treeData}
            />
          )}
        </Modal>
      )}
    </>
  );

  function configureTool(): React.ReactNode {
    console.log({data})
    return <Space direction="vertical" style={{ width: "100%" }}>
      <h3>Configure Tool Parameters</h3>
      <div>
        <label>Tool Input</label>
        <Input
          value={localNodeData.input?.toolInput || ""}
          onChange={(e) => setLocalNodeData((prev) => ({
            ...prev,
            input: { ...prev.input, toolInput: e.target.value },
          }))} />
      </div>
      <div>
        <label>Tool Output</label>
        <Input
          value={localNodeData.output?.toolOutput || ""}
          onChange={(e) => setLocalNodeData((prev) => ({
            ...prev,
            output: { ...prev.output, toolOutput: e.target.value },
          }))} />
      </div>
    </Space>;
  }
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
