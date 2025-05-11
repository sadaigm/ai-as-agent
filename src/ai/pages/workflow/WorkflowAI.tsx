import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import AgentNode from "./components/nodes/AgentNode";
import ToolNode from "./components/nodes/ToolNode";
import FlowPalette from "./components/FlowPalette";
import { Workflow, WorkflowNode } from "./workflow.types";
import StartNode from "./components/nodes/StartNode";
import WorkflowProvider, { useWorkflow } from "./components/WorkflowProvider";
import EndNode from "./components/nodes/EndNode";
import { message, Button, Steps } from "antd";
import { saveWorkflow } from "../../utils/service";
import WorkflowDetails from "./components/steps/WorkflowDetails";

const { Step } = Steps;

const nodeTypes = {
  agentNode: AgentNode,
  toolNode: ToolNode,
  startNode: StartNode,
  endNode: EndNode,
};

type InternalWorkflowAIProps = {
  workflowId: string;
};

const InternalWorkflowAI: FC<InternalWorkflowAIProps> = ({ workflowId }) => {
  const navigate = useNavigate();
  const {
    workflowName,
    setWorkflowName,
    workflowDescription,
    setWorkflowDescription,
    globalVariables,
    setGlobalVariables,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    setworkflowId,
  } = useWorkflow();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setworkflowId(workflowId);
  }, [workflowId]);

  const handleSaveWorkflow = () => {
    if (!workflowName) {
      message.error("Please provide a workflow name.");
      return;
    }

    const workflow: Workflow = {
      id: workflowId === "NEW" ? `${Date.now()}` : workflowId,
      name: workflowName,
      description: workflowDescription,
      nodes: nodes as WorkflowNode[],
      edges,
      mappings: [],
      globalVariables,
      input: {},
    };

    saveWorkflow(workflow);
    message.success("Workflow saved successfully!");
    navigate("/workflow-ai"); // Redirect to the workflow list after saving
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

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          // padding: "20px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Steps current={currentStep} style={{ marginBottom: "20px" }}>
          <Step title="Workflow Details" />
          <Step title="Workflow Editor" />
        </Steps>

        {currentStep === 0 && (
          <div
            style={{
              display: "flex",
              height: "calc(100% - 100px)",
              border: "1px solid #f0eaea",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <WorkflowDetails
              workflowName={workflowName}
              setWorkflowName={setWorkflowName}
              workflowDescription={workflowDescription}
              setWorkflowDescription={setWorkflowDescription}
              globalVariables={globalVariables}
              setGlobalVariables={setGlobalVariables}
            />
          </div>
        )}

        {currentStep === 1 && (
          <ReactFlowProvider>
            <div
              style={{
                display: "flex",
                height: "calc(100% - 100px)",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            >
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
                onDrop={(event) => {
                  event.preventDefault();
                  const data = JSON.parse(
                    event.dataTransfer.getData("application/reactflow")
                  );
                  const position = {
                    x: 0,
                    y: nodes.length * 100, // Stack nodes vertically
                  };
                  const newNode: WorkflowNode = {
                    id: `${data.nodeType}-${Date.now()}`,
                    type: data.nodeType,
                    position,
                    data: { ...data },
                  };
                  setNodes((nds) => nds.concat(newNode));
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(params) =>
                    setEdges((eds) => addEdge(params, eds))
                  }
                  fitView
                  nodeTypes={nodeTypes}
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </div>
          </ReactFlowProvider>
        )}

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          {currentStep > 0 && (
            <Button onClick={handlePrevious} style={{ marginRight: "10px" }}>
              Previous
            </Button>
          )}
          {currentStep === 0 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={handleSaveWorkflow}>
              Save Workflow
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const WorkflowAI: FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <WorkflowProvider>
      <InternalWorkflowAI workflowId={id!} />
    </WorkflowProvider>
  );
};

export default WorkflowAI;
