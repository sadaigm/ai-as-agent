import { Tool } from "../../components/types/tool";
import { authHeaders } from "../../const";
import {
  AgentToolFunction,
  AgentToolFunctionResponse,
} from "../AgentToolFunction";

class RestToolFunction implements AgentToolFunction {
  id: string;
  toolName: string;
  toolInstance: Tool;
  authHeader: any = {};
  constructor(id: string, toolName: string, toolInstance: Tool) {
    this.id = id;
    this.toolName = toolName;
    this.toolInstance = toolInstance;
    const currentAuth: any = authHeaders.filter(
      (a) => a[toolName] != undefined
    );
    console.log({currentAuth, authHeaders})
    if (currentAuth && currentAuth[0]) {
        const auth = currentAuth[0];
        if(auth && auth[toolName] && auth[toolName].token) {
            console.log(auth[toolName])
            this.authHeader = {
                'Gmheader': `Bearer ${auth[toolName].token}`,
            };
        }        
    }
  }

  async fetchData(url: string, method: string, body: any): Promise<any> {
    const options: any = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader,
      },
    };

    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text(); // Read the error response as text
      throw new Error(
        `HTTP error ${response.status}: ${response.statusText}\n${errorText}`
      );
    }

    return await response.json();
  }

  async execute(params: any): Promise<AgentToolFunctionResponse> {
    console.log(
      `executing instance ${RestToolFunction.name} ${this.id} with toolName: ${this.toolName}`,
      { params }
    );
    console.log({ toolInstance: this.toolInstance });

    const { method, url } = this.toolInstance;
    let contentObj: any = {};

    if (url && method) {
      const bodyObject = {};

      try {
        const data = await this.fetchData(url, method, bodyObject);
        console.log(data);
        contentObj.content = data;
      } catch (error: any) {
        console.error("Error:", error);
        contentObj.content = error.message;
      }
    }

    const response: AgentToolFunctionResponse = {
      role: "tool",
      tool_call_id: this.id,
      content: JSON.stringify(contentObj),
    };

    return response;
  }
}

export default RestToolFunction;
