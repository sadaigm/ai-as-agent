import React, { useEffect, useState } from "react";
import { Tree, Button, Modal, Input, message } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { Workflow, WorkflowNode } from "../../workflow.types";
import { useSubmitHandler } from "../../../../hooks/useSubmitHandler";
import {
  AgentTool,
  AIAgent,
  ChatPayload,
  ParameterV1,
  Tool,
} from "../../../../components/types/tool";
import StatusNode from "./StatusNode";

type RunWorkflowProps = {
  workflow: Workflow;
  isRunModalVisible: boolean;
  onClose: () => void;
};

const RunWorkflow: React.FC<RunWorkflowProps> = ({
  workflow,
  onClose,
  isRunModalVisible,
}) => {
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, string>>(
    workflow.nodes.reduce((acc, node) => {
      acc[node.id] = "Not Started";
      return acc;
    }, {} as Record<string, string>)
  );
  const [currentNode, setCurrentNode] = useState<WorkflowNode | null>(null);
  const [executionOrder, setExecutionOrder] = useState<WorkflowNode[]>([]);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [isParamModalVisible, setIsParamModalVisible] = useState(false);
  const [nodeParams, setNodeParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [streamingData, setStreamingData] = useState<string | null>("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
  });

  const getExecutionOrder = () => {
    const startNode = workflow.nodes.find((node) => node.type === "startNode");
    if (!startNode) {
      message.error("No start node found in the workflow.");
      return [];
    }

    const order: WorkflowNode[] = [];
    let current = startNode;

    while (current) {
      order.push(current);
      const nextEdge = workflow.edges.find(
        (edge) => edge.source === current.id
      );
      if (!nextEdge) break;
      const nextNode = workflow.nodes.find(
        (node) => node.id === nextEdge.target
      );
      if (!nextNode) break;
      current = nextNode;
    }

    return order;
  };

  useEffect(() => {
    if (currentNode && (responseData || streamingData)) {
      const response = responseData || streamingData || "";

      setNodeParams((prev) => {
        return {
          ...prev,
          [currentNode.id]: {
            ...prev[currentNode.id],
            output: { response: response },
          },
        };
      });
    }
    if (loading) {
      setNodeStatuses((prev) => ({
        ...prev,
        [currentNode?.id || ""]: "Running",
      }));
    } else {
      setNodeStatuses((prev) => ({
        ...prev,
        [currentNode?.id || ""]: "Completed",
      }));
      if (nodeIndex < executionOrder.length - 1) {
        setNodeIndex((prev) => prev + 1);
      }
    }
  }, [loading, responseData, streamingData]);

  useEffect(() => {
    if (nodeIndex == 0) {
      return;
    }
    if (nodeIndex < executionOrder.length) {
      const nextNode = executionOrder[nodeIndex];
      setCurrentNode(nextNode);
      setNodeStatuses((prev) => ({
        ...prev,
        [nextNode.id]: "Running",
      }));
      resolveParams(nextNode.params);
      setNodeParams((prev) => ({
        ...prev,
        [nextNode.id]: nextNode.params || {},
      }));
      handleExecuteNode(nextNode, nextNode.params);
    } else {
      setCurrentNode(null);
    }
  }, [nodeIndex, executionOrder]);

  const handleStartWorkflow = () => {
    const executionOrder = getExecutionOrder().filter(
      (node) => node.type !== "startNode" && node.type !== "endNode"
    );
    if (executionOrder.length === 0) return;
    setExecutionOrder(executionOrder);
    setNodeIndex(0);
    const cNode = executionOrder[0];
    setCurrentNode(cNode);
    setNodeParams((prev) => ({
      ...prev,
      [cNode.id]: cNode.params || {},
    }));
    setIsParamModalVisible(true); // Ask for the first node's parameters
  };

  const resolveParams = (params: any) => {
    if (!params?.input) return;

    const getNode = (id: string) => {
      if (nodeParams[id]) {
        return {
          id: id,
          params: nodeParams[id],
        };
      }
      //   else {
      //     const nodes = getExecutionOrder().filter(
      //       (node) => node.type !== "startNode" && node.type !== "endNode"
      //     );
      //     console.log({ nodes });
      //     return nodes.find((node) => node.id === id);
      //   }
    };

    Object.keys(params.input).forEach((key) => {
      if (typeof params.input[key] === "string") {
        params.input[`${key}`] = params.input[key].replace(
          /{{(.*?)}}/g,
          (_, variable) => {
            console.log({ variable });
            const [nodeId, ...pathParts] = variable.trim().split(".");
            const node = getNode(nodeId);
            console.log({ resolveNode: node });
            if (!node) return `{{${variable}}}`;
            const path = pathParts.join(".");
            console.log({ path });
            // return (node.params as any)[path];
            const resolvedValue = pathParts.reduce((acc: any, part: string) => {
              return acc ? acc[part] : undefined;
            }, node.params);

            return resolvedValue !== undefined
              ? resolvedValue
              : `{{${variable}}}`;
          }
        );
      }
    });
    console.log({ params });
  };

  const handleExecuteNode = async (node: WorkflowNode, params: any) => {
    setNodeStatuses((prev) => ({ ...prev, [node.id]: "Running" }));
    resolveParams(params);
    try {
      if (node.type === "agentNode") {
        const agent = node.data.node as AIAgent;
        const agentTools: AgentTool[] =
          agent?.tools?.map((tool) => {
            const required: string[] = [];
            const properties: any = {};
            tool.function.parameters.forEach((param) => {
              if (param.required) {
                required.push(param.name);
              }
              properties[param.name] = {
                type: param.type,
                description: param.description,
                enum: param.enum,
              };
            });
            const parameters: ParameterV1 = {
              type: "object",
              required,
              properties,
            };
            return {
              type: tool.type,
              function: {
                name: tool.function.name,
                description: tool.function.description,
                parameters,
              },
            };
          }) || [];

        const payload: ChatPayload = {
          model: agent.model || "llama-3.2-1b-instruct",
          messages: [
            { role: "system", content: agent.systemPrompt },
            { role: "user", content: `${params?.input?.userPrompt}` },
          ],
          temperature: 0.8,
          stream: agent.stream,
        };
        if (agentTools.length > 0) {
          payload.tools = agentTools;
        }
        handleSubmit(payload);
      }
    } catch (error) {
      setNodeStatuses((prev) => ({ ...prev, [node.id]: "Failed" }));
      message.error(`Execution failed for node: ${getNodeName(node)}`);
    }
  };

  const handleSubmitParams = () => {
    if (currentNode) {
      handleExecuteNode(currentNode, nodeParams[currentNode.id]);
    }
    setIsParamModalVisible(false);
  };

  const getNodeParams = (node: WorkflowNode) => {
    console.log({ params: node.params });
    const params = nodeParams[node.id] || node.params;
    // resolveParams(params);
    if (node.type === "agentNode") {
      return [
        {
          title: "Input",
          key: `${node.id}.input`,
          value: params?.input?.userPrompt || "",
          children: [
            {
              title: `userPrompt : ${params?.input?.userPrompt || ""}`,
              key: `${node.id}.input.userPrompt`,
              value: params?.input?.userPrompt || "",
            },
          ],
        },
        {
          title: "Output",
          key: `${node.id}.output`,
          value: params?.output?.response || "",
          children: [
            {
              title: `response : ${params?.output?.response || ""}`,
              key: `${node.id}.output.response`,
              value: params?.output?.response || "",
            },
          ],
        },
      ];
    } else if (node.type === "toolNode") {
      const toolParams = [];
      const toolInputs = getToolInput();
      if (toolInputs.length > 0) {
        toolParams.push({
          title: "Input",
          key: `${node.id}.input`,
          value: JSON.stringify(params?.input || {}, null, 2),
          children: toolInputs,
        });
      }

      return [
        ...toolParams,
        {
          title: "Output",
          key: `${node.id}.output`,

          children: [
            {
              title: `response : ${params?.output?.response || ""}`,
              key: `${node.id}.output.response`,
              value: params?.output?.response || "",
            },
          ],
        },
      ];
    }
    return [];

    function getToolInput() {
      return (
        (params?.input &&
          Object.keys(params?.input).map((key) => ({
            title: `${key} : ${params?.input[key] || ""}`,
            key: `${node.id}.input.${key}`,
            value: params?.input[key] || "",
          }))) ||
        []
      );
    }
  };

  console.log({ workflow });
  const treeData = getExecutionOrder()
    .filter((node) => node.type !== "startNode" && node.type !== "endNode")
    .filter(
      (node) =>
        node.type !== "startNode" &&
        node.type !== "endNode" &&
        node.type !== "decision"
    )
    .map((node) => ({
      // title: `${getNodeName(node)} (${nodeStatuses[node.id]})`,
      title: <StatusNode name={getNodeName(node)||"Unknown"} status={nodeStatuses[node.id]} />,
      key: node.id,

      children: [
      // Add the model name as a child node
      ...(node.type === "agentNode"
        ? [
            {
              title: "Model",
              key: `${node.id}.model`,
              children:[
                {
                  title: <span>
                  <ThunderboltOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
                  {(node.data.node as AIAgent).model || "Unknown"}
                </span>,
                  key: `${node.id}.model.${(node.data.node as AIAgent).model}`,
                }
              ]
            },
          ]
        : []),
      ...getNodeParams(node),
    ],
    }));

  function getNodeName(currentNode: WorkflowNode | null) {
    console.log({ currentNode });
    if (!currentNode) return "unKnown";
    if (currentNode.type === "agentNode") {
      return (currentNode.data.node as AIAgent).name;
    } else if (currentNode.type === "toolNode") {
      return (currentNode.data.node as Tool).function.name;
    }
  }

  const getNodeInput = () => {
    if (!currentNode) return "";
    if (currentNode.type === "agentNode") {
      const agentParam =
        nodeParams[currentNode?.id || ""]?.input?.userPrompt || "";
      return agentParam;
    } else if (currentNode.type === "toolNode") {
      const toolParam = nodeParams[currentNode?.id || ""]?.input || {};
      return JSON.stringify(toolParam || {}, null, 2);
    }
    return "";
  };
  const handleCancel = () => {
    if (abortController) {
      abortController.abort(); // Abort the fetch request if in progress
      message.warning("Request was canceled");
      setLoading(false); // Stop loading
    }
  };

  const handleRunModalClose = () => {
    handleCancel();
    onClose();
  };
  return (
    <Modal
      title={`Run Workflow: ${workflow?.name}`}
      visible={isRunModalVisible}
      onCancel={handleRunModalClose}
      footer={null}
      width="80%"
    >
      <div>
        <Tree treeData={treeData} defaultExpandAll />
        <Button
          type="primary"
          onClick={handleStartWorkflow}
          style={{ marginTop: "20px" }}
        >
          Start Workflow
        </Button>
        <Modal
          title={`Enter Parameters for ${getNodeName(currentNode)}`}
          visible={isParamModalVisible}
          onCancel={() => {
            handleCancel();
            setIsParamModalVisible(false);
          }}
          onOk={() => handleSubmitParams()}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter parameters as JSON"
            value={getNodeInput()}
            onChange={(e) =>
              setNodeParams((prev) => ({
                ...prev,
                [currentNode?.id || ""]: {
                  ...prev[currentNode?.id || ""],
                  input: { userPrompt: e.target.value },
                },
              }))
            }
          />
        </Modal>
      </div>
    </Modal>
  );
};

export default RunWorkflow;
