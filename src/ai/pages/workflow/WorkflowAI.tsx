import React, { useCallback, useEffect } from "react";
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
import { WorkflowNode } from "./workflow.types";
import StartNode from "./components/nodes/StartNode";
import WorkflowProvider, { useWorkflow } from "./components/WorkflowProvider";
import EndNode from "./components/nodes/EndNode";

const nodeTypes = {
  agentNode: AgentNode,
  toolNode: ToolNode,
  startNode: StartNode,
  endNode: EndNode
};

const InternalWorkflowAI: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const { flowStateValue , setFlowStateValue } = useWorkflow();

  const NODE_WIDTH = 200; // Width of each node
  const NODE_HEIGHT = 100; // Height of each node
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
    const x =( data.nodeType === "startNode" ||  data.nodeType === "endNode" )? 100 : 0 // Horizontal position
    const position = {
      x,
      y: nodeCount * (NODE_HEIGHT + VERTICAL_SPACING), // Vertical position
    };

    const newNode: WorkflowNode = {
      id: `${data.nodeType}-${Date.now()}`,
      type: data.nodeType,
      position,
      data: { ...data,
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

  return (
    <ReactFlowProvider>
      <div style={{ display: "flex", height: "100%" }}>
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
  );
};




export const WorkflowAI = () => {
  return (
    <WorkflowProvider>
    <InternalWorkflowAI />
    </WorkflowProvider>
  )
}


export default WorkflowAI;
