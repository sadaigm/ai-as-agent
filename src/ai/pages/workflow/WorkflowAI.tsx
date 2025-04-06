import React, { FC, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import AgentNode from "./components/nodes/AgentNode";
import ToolNode from "./components/nodes/ToolNode";
import FlowPalette from "./components/FlowPalette";
import { Workflow, WorkflowNode } from "./workflow.types";
import StartNode from "./components/nodes/StartNode";
import WorkflowProvider, { useWorkflow } from "./components/WorkflowProvider";
import EndNode from "./components/nodes/EndNode";
import { message, Button, Modal, Space, Input, Steps } from "antd";
import { saveWorkflow } from "../../utils/service";

const { Step } = Steps;

const nodeTypes = {
  agentNode: AgentNode,
  toolNode: ToolNode,
  startNode: StartNode,
  endNode: EndNode,
};

type InternalWorkflowAIProps = {
  handleClose: () => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
};

const InternalWorkflowAI: FC<InternalWorkflowAIProps> = ({
  handleClose,
  isModalVisible,
  setIsModalVisible,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");

  //   const { flowStateValue , setFlowStateValue } = useWorkflow();

  const NODE_WIDTH = 200; // Width of each node
  const NODE_HEIGHT = 100; // Height of each node
  const SMALL_NODE_HEIGHT = 50; // Height of small nodes
  const NODES_PER_ROW = 4; // Number of nodes per row
  const HORIZONTAL_SPACING = 50; // Horizontal spacing between nodes
  const VERTICAL_SPACING = 50; // Vertical spacing between rows

  // Handle edge connections
  const onConnect = useCallback(
    (params: any) => {
      console.log({ params });
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  console.log({ edges, nodes });

  // Handle drop event to add nodes to the canvas
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const data = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );

    // Calculate the position for the new node
    const nodeCount = nodes.length;
    const row = Math.floor(nodeCount / NODES_PER_ROW); // Determine the row
    const col = nodeCount % NODES_PER_ROW; // Determine the column
    const actualNodes = nodes.filter((node) => node.type=== "agentNode" || node.type=== "toolNode")
      const isCurrentNodeSmall = data.nodeType === "startNode" || data.nodeType === "endNode";
    const x =
      isCurrentNodeSmall ? 100 : 0; // Horizontal position
    const position = {
      x,
      y: nodeCount * ((NODE_HEIGHT ) + VERTICAL_SPACING), // Vertical position
    };

    console.log({position})

    const newNode: WorkflowNode = {
      id: `${data.nodeType}-${Date.now()}`,
      type: data.nodeType,
      position,
      data: {
        ...data,
        direction: "left", // Default direction for new nodes
      },
    };

    setNodes((nds) => nds.concat(newNode as any));
  };

  // Allow drag over the canvas
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleSaveWorkflow = () => {
    if (!workflowName) {
      message.error("Please provide a workflow name.");
      return;
    }

    const workflow: Workflow = {
      id: `${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      nodes: nodes as WorkflowNode[],
      edges,
      mappings: [],
    };

    saveWorkflow(workflow);
    message.success("Workflow saved successfully!");
    handleFinish();
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!workflowName) {
        message.error("Please provide a workflow name.");
        return;
      }
      setCurrentStep(1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setWorkflowName("");
    setWorkflowDescription("");
    handleClose();
  };

  return (
    <Modal
      className="add__ai__workflow-modal fullmodel"
      title="Create New Workflow"
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setCurrentStep(0);
        handleClose();
      }}
      footer={[
        <Button onClick={handlePrevious} style={{ marginRight: "10px" }}>
          Previous
        </Button>,
        currentStep==0?<Button type="primary" onClick={handleNext}>
          Next
        </Button>:
        <Button type="primary" onClick={handleSaveWorkflow}>
          Save Workflow
        </Button>,
      ]}
      width={800}
    >
      <Steps current={currentStep} style={{ marginBottom: "20px" }}>
        <Step title="Workflow Details" />
        <Step title="Workflow Editor" />
      </Steps>

      {currentStep === 0 && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <Input.TextArea
            placeholder="Workflow Description"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            rows={4}
          />
          <div style={{ textAlign: "right" }}></div>
        </Space>
      )}

      {currentStep === 1 && (
        <ReactFlowProvider>
          <div style={{ display: "flex", height: "calc( 100% - 50px )" }}>
            {/* Left Panel */}
            <FlowPalette />

            {/* Right Panel */}
            <div
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid #ddd",
                position: "relative",
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect} // Enable edge connections
                fitView
                nodeTypes={nodeTypes} // Register custom node types
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>
        </ReactFlowProvider>
      )}
    </Modal>
  );
};

export const WorkflowAI: FC<InternalWorkflowAIProps> = (
  props: InternalWorkflowAIProps
) => {
  return (
    <WorkflowProvider>
      <InternalWorkflowAI {...props} />
    </WorkflowProvider>
  );
};

export default WorkflowAI;
