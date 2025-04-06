import { AIAgent, Tool, ToolMessage } from "../../components/types/tool"

export type WorkflowNode = {
    type: "agentNode" | "toolNode" | "start" | "end" | "decision";
    data: AIAgent| Tool|string;
    id: string;    
    position: {
        x: number;
        y: number;
    }
}