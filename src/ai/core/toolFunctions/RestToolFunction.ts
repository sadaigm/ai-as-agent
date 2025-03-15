import { Environment } from "../../components/types/environment";
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
  constructor(id: string, toolName: string, toolInstance: Tool, env: Environment|undefined) {
    this.id = id;
    this.toolName = toolName;
    this.toolInstance = toolInstance;
    if(env) {
      env.headers.forEach((header) => {
        this.authHeader[header.key] = header.value;
      });
    }
    else {
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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  async execute(params: any): Promise<AgentToolFunctionResponse> {
    console.log(
      `executing instance ${RestToolFunction.name} ${this.id} with toolName: ${this.toolName}`,
      { params }
    );
    console.log({ toolInstance: this.toolInstance });
    let queryParams ="";
    const { method, url, apiPath } = this.toolInstance;

    if(Object.keys(params).length> 0){
      queryParams = Object.keys(params).map((key) => {
        return `${key}=${params[key]}`;
      }
      ).join("&");
      if(apiPath?.includes("?")){
        queryParams = `&${queryParams}`;
      }
      else{
        queryParams = `?${queryParams}`;
      }
    }

    
    let contentObj: any = {};

    if (url && method && apiPath) {
      const bodyObject = {};
      const apiFullPath = `${url}${apiPath}${queryParams}`;
      try {
        const data = await this.fetchData(apiFullPath, method, bodyObject);
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
