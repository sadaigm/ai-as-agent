import { AgentToolFunctionResponse } from "../../core/AgentToolFunction";

export interface SystemRolePrompt {
  id: string;
  systemRole: string;
  systemPrompt: string;
}

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  enum?: string[];
}

export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Parameter[];
  };
}
export type Property = {
  type: string;
  description: string;
  enum?: string[];
};
export type PropertiesV1 = {
  [key: string]: Property;
};

export type ParameterV1 = {
  type: string;
  required: string[];
  properties?: PropertiesV1;
};

export type AgentTool = {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: ParameterV1;
  };
};


export type UserMessage = { role: string; content: any };
export type SystemMessage = UserMessage & {  };
export type ToolMessage = { role: string, tool_calls: ToolCall[] };

export interface ChatPayload {
  model: string;
  messages: Array<UserMessage|ToolMessage| AgentToolFunctionResponse>;
  temperature: Number;
  stream: boolean;
  tools?: AgentTool[];
}

export type ToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

export const convertTools2AgentTools = (tools: Tool[]): AgentTool[] => {
  console.log({ tools });
  return tools.map((tool) => {
    const properties: PropertiesV1 = {};
    const required: string[] = [];
    tool.function.parameters.forEach((parameter) => {
      const { name, type, description } = parameter;
      if (parameter.required) {
        required.push(name);
      }
      properties[name] = {
        type,
        description,
        enum: parameter.enum,
      };
    });
    const parameters: ParameterV1 = {
      type: "object",
      properties,
      required,
    };
    const functionV1 = { ...tool.function, parameters };
    const agentT: AgentTool = { ...tool, function: functionV1 };
    return agentT;
  });
};
