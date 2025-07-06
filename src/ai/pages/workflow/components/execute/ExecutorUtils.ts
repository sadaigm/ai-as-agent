import { message } from "antd";
import { AIAgent } from "../../../../components/types/tool";
import { Tool } from "../../../tools/ToolItem";
import { Workflow, WorkflowNode } from "../../workflow.types";

export function getNodeName(currentNode: WorkflowNode | null) {
  console.log({ currentNode });
  if (!currentNode) return "unKnown";
  if (currentNode.type === "agentNode") {
    return (currentNode.data.node as AIAgent).name;
  } else if (currentNode.type === "toolNode") {
    return (currentNode.data.node as Tool).function.name;
  }
}

export const getNodeInput = (
  currentNode: WorkflowNode | null,
  nodeParams: Record<string, any>
) => {
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

export  const getExecutionOrder = (workflow: Workflow) => {
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
export const getExecutionNodes = ( workflowNodes: WorkflowNode[]) => {
    return workflowNodes.filter(
    (node) => node.type !== "startNode" && node.type !== "endNode"
  );
}
  
