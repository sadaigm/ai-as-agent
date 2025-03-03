export type AgentToolFunctionResponse = {
  role: string;
  tool_call_id: string;
  content: string;
};

export interface AgentToolFunction {
  execute(params: any): Promise<AgentToolFunctionResponse>;
}

export class WeatherFunction implements AgentToolFunction {
  static name: string = "WeatherFunction";
  id: string;
  toolName: string;
  constructor(id: string, toolName: string) {
    this.id = id;
    this.toolName = toolName;
  }

  execute(params: any): Promise<AgentToolFunctionResponse> {
    console.log(
      `executing instance ${WeatherFunction.name} ${this.id} with toolName: ${this.toolName}`,
      { params }
    );
    const temperature = Math.random() * 10;
    const content = {
      temperature: `${temperature} degree celsius`,
      location: params.location,
    };
    console.log({ toolName: this.toolName, params, content });
    const promise = new Promise<AgentToolFunctionResponse>((resolve) => {
      const response: AgentToolFunctionResponse = {
        role: "tool",
        tool_call_id: this.id,
        content: JSON.stringify(content),
      };
      resolve(response);
    });

    return promise;
  }
}

export class DefaultFunction implements AgentToolFunction {
  static name: string = "DefaultFunction";
  id: string;
  toolName: string;
  constructor(id: string, toolName: string) {
    this.id = id;
    this.toolName = toolName;
  }
  execute(params: any): Promise<AgentToolFunctionResponse> {
    console.log(
      `executing instance ${DefaultFunction.name} ${this.id} with toolName: ${this.toolName}`,
      { params }
    );
    const content = {
      content: "unable to process the request, try again after sometime",
    };
    const promise = new Promise<AgentToolFunctionResponse>((r, resolve) => {
      const response: AgentToolFunctionResponse = {
        role: "tool",
        tool_call_id: this.id,
        content: JSON.stringify(content),
      };
      resolve(response);
    });

    return promise;
  }
}
