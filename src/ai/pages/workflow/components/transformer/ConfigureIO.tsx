import React, { FC, useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Space, Popover, Tree, Empty } from "antd";
import {
  CheckOutlined,
  KeyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { NodeParams } from "../../workflow.types";
import { AgentTool, AIAgent } from "../../../../components/types/tool";
import { Tool } from "../../../tools/ToolItem";
import { useWorkflow } from "../WorkflowProvider";
import { getNodes } from "../../../../utils/agent-utils";
import { getRandomColor } from "../../../../utils/ui-utils";
import ConfigureTool from "./ConfigureTool";
import ConfigureAgent from "./ConfigureAgent";

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
  const { currentWorkflowId, edges, nodes, globalVariables } = useWorkflow();
  const [treeData, settreeData] = useState<any[]>([]);

  useEffect(() => {
    setLocalNodeData(nodeParams); // Initialize localNodeData with nodeParams
  }, [nodeParams]);

  useEffect(() => {
    const currentNode = nodes.find((node: any) => node.id === nodeId);
    console.log(currentNode, nodes, nodeId);
    if (currentNode && currentNode.params) {
      setLocalNodeData(currentNode.params);
    } // Update title based on nodeType and data
  }, [nodeId, nodes]);

  const handleSave = () => {
    onUpdateNodeData(localNodeData); // Pass updated data back to the parent
    handleClose();
  };

  function prepareConfigure(): void {
    if (currentWorkflowId === nodeId) {
      const previousNodes = getNodes(edges, currentWorkflowId);
      const treeNodes: any[] = [];
      const gv = Object.keys(globalVariables);
      if (gv.length > 0) {        
        treeNodes.push({
          title: `Global Variables`,
          key: "globalVariables",
          icon: (
            <KeyOutlined style={{ color: getRandomColor() || "#2196f3" }} />
          ),
          children: gv.map((key) => {
            return {
              title: key,
              key: "{{variable." + key + "}}",
              icon: (
                <CheckOutlined
                  style={{ color: getRandomColor() || "#2196f3" }}
                />
              ),
            };
          })||[],
        });
      }

      nodes.forEach((node: any) => {
        if (previousNodes.includes(node.id)) {
          if (node.type === "agentNode") {
            const agent = node.data.node as AIAgent;
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
            const tool = node.data.node as Tool;
            const paramInput = tool.function.parameters.map((p: any) => {
              return {
                title: p.name,
                key: "{{" + node.id + ".parameters." + p.name + "}}",
              };
            });

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
        style={{ fontSize: "11px" }}
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
            <ConfigureAgent
              data={data as AIAgent}
              nodeId={nodeId}
              nodeParams={localNodeData}
              onUpdateNodeData={(updatedNodeData) => {
                console.log("io/update");
                setLocalNodeData(updatedNodeData);
              }}
              nodeType={nodeType}
              treeData={treeData}
            />
          )}
          {nodeType === "toolNode" && (
            // configureTool()
            <ConfigureTool
              data={data as Tool}
              nodeId={nodeId}
              nodeParams={localNodeData}
              onUpdateNodeData={(updatedNodeData) => {
                console.log("io/update");
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
    console.log({ data });
    return (
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
    );
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
