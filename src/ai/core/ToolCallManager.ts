import { ChatPayload, ToolCall, ToolMessage } from "../components/types/tool";
import ChatService, { createChatService } from "../services/ChatService";
import { handleNonStreamResponse } from "../utils/response-utils";
import { AgentToolFactory } from "./AgentToolFactory";
import { AgentToolFunctionResponse } from "./AgentToolFunction";

class ToolCallManager {
  toolCalls: ToolCall[];
  payload: ChatPayload;
  chatInstance: ChatService;
  constructor(payload: ChatPayload, toolCalls: ToolCall[]) {
    this.toolCalls = toolCalls;
    this.payload = payload;
    this.chatInstance = createChatService();
  }

  async interceptToolCalls() {
    const toolResponses = this.toolCalls
      .map((toolCall) => this.interceptToolCall(toolCall))
      .filter((t) => t);
    // invoke agent callback
    return await this.callBackToAgent(this.toolCalls, toolResponses as []);
  }

  interceptToolCall(toolCall: ToolCall) {
    const {
      id,
      function: { name, arguments: args },
      type,
    } = toolCall;
    if (type === "function") {
      const agentToolInstance = AgentToolFactory.getAgentToolInstance(id, name);
      if (agentToolInstance) {
        const params = JSON.parse(args);
        const toolResponse: AgentToolFunctionResponse =
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
    const agentRequest = { ...this.payload };
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
