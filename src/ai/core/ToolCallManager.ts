import {
  ChatPayload,
  Tool,
  ToolCall,
  ToolMessage,
} from "../components/types/tool";
import ChatService, { createChatService } from "../services/ChatService";
import { handleNonStreamResponse } from "../utils/response-utils";
import { getTools } from "../utils/service";
import { AgentToolFactory } from "./AgentToolFactory";
import { AgentToolFunctionResponse } from "./AgentToolFunction";

class ToolCallManager {
  toolCalls: ToolCall[];
  payload: ChatPayload;
  chatInstance: ChatService;
  tools: Tool[] = [];
  constructor(payload: ChatPayload, toolCalls: ToolCall[]) {
    this.toolCalls = toolCalls;
    this.payload = payload;
    this.chatInstance = createChatService();
  }
  async initializeTools() {
    this.tools = await getTools();
  }

  getToolInstance(name: string) {
    console.log({ tools: this.tools, name });
    return this.tools.find((tool) => tool.function.name === name);
  }

  async interceptToolCalls() {
    await this.initializeTools();
    const toolResponses = await Promise.all(
      this.toolCalls
        .map((toolCall) =>
          this.interceptToolCall(
            toolCall,
            this.getToolInstance(toolCall.function.name)
          )
        )
        .filter((t) => t)
    );
    // invoke agent callback
    // I think the list of promise need to resolve here
    return await this.callBackToAgent(this.toolCalls, toolResponses as []);
  }

  interceptToolCall(toolCall: ToolCall, toolInstance: Tool | undefined) {
    const {
      id,
      function: { name, arguments: args },
      type,
    } = toolCall;
    if (type === "function" && toolInstance) {
      const agentToolInstance = AgentToolFactory.getAgentToolInstance(
        id,
        name,
        toolInstance
      );
      if (agentToolInstance) {
        const params = JSON.parse(args);
        const toolResponse: Promise<AgentToolFunctionResponse> =
          agentToolInstance.execute(params);
        if (toolResponse) {
          return toolResponse;
        }
      }
    }
  }

  async callBackToAgent(
    toolCalls: ToolCall[],
    toolResponses: AgentToolFunctionResponse[]
  ) {
    const agentRequest = { ...this.payload, stream: true };
    delete agentRequest["tools"];
    //
    const toolMessage: ToolMessage = {
      role: "assistant",
      tool_calls: [...toolCalls],
    };
    agentRequest.messages.push(toolMessage);
    toolResponses.forEach((res) => agentRequest.messages.push(res));
    agentRequest.stream = false;
    const response = await this.chatInstance.invoke(
      agentRequest,
      new AbortController()
    );
    if (!response.ok) {
      throw new Error("Failed to send request");
    }
    return await handleNonStreamResponse(response, this.payload);
  }
}

export default ToolCallManager;
