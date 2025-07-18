import React, { useEffect, useState } from "react";
import { Tree, Button, Modal, message } from "antd";
import { PartitionOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Workflow, WorkflowNode } from "../../workflow.types";
import { useSubmitHandler } from "../../../../hooks/useSubmitHandler";
import {
  AgentTool,
  AIAgent,
  ChatPayload,
  ParameterV1,
} from "../../../../components/types/tool";
import StatusNode from "./StatusNode";
import WorkflowResponse from "./WorkflowResponse";
import "./workflow.css";
import { getExecutionOrder, getNodeName } from "./ExecutorUtils";
import RuntimeParameters from "./RuntimeParameters";

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
  const [globalVariableParams, setGlobalVariableParams] = useState<
    Record<string, any>
  >(workflow.globalVariables || {});
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
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false); // Track overall workflow status

  useEffect(() => {
    const nodeIds = workflow.nodes
      .map((node) => node.id)
      .filter((id) => id !== undefined);
    const status =
      nodeIds
        .map((id) => nodeStatuses[id] && nodeStatuses[id] === "Running")
        .reduce((a, b) => a || b, false) || false;
    console.log({ status });
    setIsWorkflowRunning(status);
    // status ? setIsWorkflowRunning(true) : setIsWorkflowRunning(false)
  }, [nodeStatuses]);

  const handleSubmit = useSubmitHandler({
    setLoading,
    setResponseData,
    setStreamingData,
    setAbortController,
  });

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
      setNodeStatuses((prev) => {
        // check if the current node is running
        if (prev[currentNode?.id || ""] === "Running") {
          // If the current node is running, set it to completed
          return {
            ...prev,
            [currentNode?.id || ""]: "Completed",
          };
        }
        return prev;
      });
      if (nodeIndex < executionOrder.length - 1) {
        setNodeIndex((prev) => prev + 1);
      }
      setAbortController(null); // Reset abort controller
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
    const executionOrder = getExecutionOrder(workflow).filter(
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
          className: "ai_workflow__output",
          value: params?.output?.response || "",
          children: [
            {
              title: (
                <WorkflowResponse
                  key={`${node.id}.output.response`}
                  response={params?.output?.response || ""}
                  status={nodeStatuses[node.id]}
                />
              ),
              className: "ai_workflow__output-response",
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
              title: (
                <WorkflowResponse
                  key={`${node.id}.output.response`}
                  response={params?.output?.response || ""}
                  status={nodeStatuses[node.id]}
                />
              ),
               className: "ai_workflow__output-response",
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

  const getNodeId = (node: WorkflowNode) => {
    return [
      {
        title: `Node Id`,
        key: `${node.id}.id`,
        value: node.id,
        children: [
          {
            title: `${node.id}`,
            key: `${node.id}.value`,
            value: node.id,
          },
        ],
      },
    ];
  };

  console.log({ workflow });
  const treeData = getExecutionOrder(workflow)
    .filter((node) => node.type !== "startNode" && node.type !== "endNode")
    .filter(
      (node) =>
        node.type !== "startNode" &&
        node.type !== "endNode" &&
        node.type !== "decision"
    )
    .map((node) => ({
      // title: `${getNodeName(node)} (${nodeStatuses[node.id]})`,
      title: (
        <StatusNode
          name={getNodeName(node) || "Unknown"}
          status={nodeStatuses[node.id]}
        />
      ),
      key: node.id,

      children: [
        // get the node id as a child node
        ...getNodeId(node),

        // Add the model name as a child node
        ...(node.type === "agentNode"
          ? [
              {
                title: "Model",
                key: `${node.id}.model`,
                children: [
                  {
                    title: (
                      <span>
                        <ThunderboltOutlined
                          style={{ color: "#1890ff", marginRight: "5px" }}
                        />
                        {(node.data.node as AIAgent).model || "Unknown"}
                      </span>
                    ),
                    key: `${node.id}.model.${
                      (node.data.node as AIAgent).model
                    }`,
                  },
                ],
              },
            ]
          : []),
        ...getNodeParams(node),
      ],
    }));

  const handleCancel = () => {
    if (abortController) {
      try {
        abortController.abort(); // Abort the fetch request if in progress
        message.warning("Request was Cancelled");
        setNodeStatuses((prev) => {
          return {
            ...prev,
            [currentNode?.id || ""]: "Cancelled",
          };
        });
        setNodeIndex(executionOrder.length); // Move to the last node
        setLoading(false); // Stop loading
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error during cancellation:", error);
        }
      }
    }
  };

  const handleRunModalClose = () => {
    handleCancel();
    onClose();
  };
  const getTitle = (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <PartitionOutlined style={{ color: "#1890ff", marginRight: "5px" }} />
          <span>{`Run Workflow: ${workflow?.name}`}</span>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      className="ai_workflow__run-modal fullmodel"
      title={getTitle}
      visible={isRunModalVisible}
      onCancel={handleRunModalClose}
      footer={[
        <Button
          type="primary"
          onClick={handleStartWorkflow}
          disabled={isWorkflowRunning}
        >
          Start Workflow
        </Button>,
        <>
          {isWorkflowRunning && (
            <Button key="stop" onClick={handleCancel}>
              Abort
            </Button>
          )}
        </>,
      ]}
      // width="80%"
    >
      <div>
        <Tree treeData={treeData} defaultExpandAll />

        {isParamModalVisible && (
          <RuntimeParameters
            globalVariableParams={globalVariableParams}
            setGlobalVariableParams={setGlobalVariableParams}
            executionNodes={getExecutionOrder(workflow)}
            nodeParams={nodeParams}
            setNodeParams={setNodeParams}
            isParamModalVisible={isParamModalVisible}
            setIsParamModalVisible={setIsParamModalVisible}
            handleCancel={handleCancel}
            handleSubmitParams={handleSubmitParams}
          />
        )}
      </div>
    </Modal>
  );
};

export default RunWorkflow;
