import { Environment } from "../components/types/environment";
import { Tool } from "../components/types/tool";
import { DefaultFunction,  WeatherFunction } from "./AgentToolFunction";
import RestToolFunction from "./toolFunctions/RestToolFunction";


export class AgentToolFactory {
  static getAgentToolInstance(id: string, toolName: string, toolInstance: Tool, env: Environment|undefined) {
    console.log("find the tool Function Implementation for " + toolName);
    if(toolInstance.type === "rest"){
      return new RestToolFunction(id, toolName, toolInstance, env);
    }
    switch (toolName) {
      case "get_current_weather":
        return new WeatherFunction(id, toolName);

      default:
        console.warn(
          "tool function Implementation not found, toolName : " + toolName
        );
        return new DefaultFunction(id,toolName)
    }
  }
}
