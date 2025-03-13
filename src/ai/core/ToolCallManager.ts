import { Environment } from "../components/types/environment";
import {
  ChatPayload,
  Tool,
  ToolCall,
  ToolMessage,
} from "../components/types/tool";
import ChatService, { createChatService } from "../services/ChatService";
import { handleNonStreamResponse } from "../utils/response-utils";
import { getEnvironments, getTools } from "../utils/service";
import { AgentToolFactory } from "./AgentToolFactory";
import { AgentToolFunctionResponse } from "./AgentToolFunction";

class ToolCallManager {
  toolCalls: ToolCall[];
  payload: ChatPayload;
  chatInstance: ChatService;
  tools: Tool[] = [];
  environments: Environment[] = [];
  constructor(payload: ChatPayload, toolCalls: ToolCall[]) {
    this.toolCalls = toolCalls;
    this.payload = payload;
    this.chatInstance = createChatService();
  }
  async initializeTools() {
    this.tools = await getTools();
    this.environments = await getEnvironments();
  }

  getToolInstance(name: string) {
    console.log({ tools: this.tools, name });
    return this.tools.find((tool) => tool.function.name === name);
  }
  getEnvironmentInstance(environmentId: string) {
    return this.environments.find((env) => env.id === environmentId);
  }

  async interceptToolCalls(toolStream: boolean, controller: AbortController) {
    await this.initializeTools();
    const toolResponses = await Promise.all(
      this.toolCalls
        .map((toolCall) => {
          const toolInstance = this.getToolInstance(toolCall.function.name);
          const env = toolInstance?.environmentId ? this.getEnvironmentInstance(toolInstance.environmentId) : undefined;
          return this.interceptToolCall(toolCall, toolInstance, env);
        })
        .filter((t) => t)
    );
    // invoke agent callback
    // I think the list of promise need to resolve here
    return await this.callBackToAgent(
      this.toolCalls,
      toolResponses as [],
      toolStream,
      controller
    );
  }

  interceptToolCall(
    toolCall: ToolCall,
    toolInstance: Tool | undefined,
    env: Environment | undefined
  ) {
    const {
      id,
      function: { name, arguments: args },
      type,
    } = toolCall;
    if (type === "function" && toolInstance) {
      const agentToolInstance = AgentToolFactory.getAgentToolInstance(
        id,
        name,
        toolInstance,
        env
      );
      if (agentToolInstance) {
        const params = args && args !== "" ? JSON.parse(args) : {};
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
    toolResponses: AgentToolFunctionResponse[],
    toolStream: boolean,
    controller: AbortController
  ) {
    const agentRequest = { ...this.payload, stream: toolStream };
    delete agentRequest["tools"];
    //
    const toolMessage: ToolMessage = {
      role: "assistant",
      tool_calls: [...toolCalls],
    };
    agentRequest.messages.push(toolMessage);
    toolResponses.forEach((res) => agentRequest.messages.push(res));
    agentRequest.stream = toolStream;
    const response = await this.chatInstance.invoke(agentRequest, controller);
    if (!response.ok) {
      throw new Error("Failed to send request");
    }
    // return await handleNonStreamResponse(response, this.payload, toolStream);
    return response;
  }
}

export default ToolCallManager;
