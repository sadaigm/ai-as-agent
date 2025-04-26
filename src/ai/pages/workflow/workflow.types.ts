import { AIAgent, Tool, ToolMessage } from "../../components/types/tool"

export type WorkflowNode = {
    type: "agentNode" | "toolNode" | "start" | "end" | "decision";
    data: NodeData;
    id: string;
    
    position: {
        x: number;
        y: number;
    }
}

export type NodeData = (AIAgent| Tool|string) & {
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
}