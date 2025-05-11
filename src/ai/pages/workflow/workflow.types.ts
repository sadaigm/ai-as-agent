import { AIAgent, Tool } from "../../components/types/tool"

export type WorkflowNode = {
    type: "agentNode" | "toolNode" | "startNode" | "endNode" | "decision";
    data : NodeInfo;
    // data: AIAgent| Tool|string;
    id: string;    
    params?: NodeParams
    position: {
        x: number;
        y: number;
    }
    currentStep?: number;
}
export type NodeInfo = {
    nodeType: "agentNode" | "toolNode" | "endNode" | "endNode" | "decision";
    node: AIAgent| Tool|string;
}

export type NodeParams = {
    input?: any;
    output?: any;    
}

export type Workflow  = {
    nodes: WorkflowNode[];
    edges: any[];
    id: string;
    name: string;
    description: string;   
    mappings: any[]
    globalVariables: any;
    input: any;
}