import { WeatherFunction } from "./AgentToolFunction";

export class AgentToolFactory {
  static getAgentToolInstance(id: string, toolName: string) {
    console.log("find the tool Function Implementation for " + toolName);
    switch (toolName) {
      case "get_current_weather":
        return new WeatherFunction(id, toolName);

      default:
        console.warn(
          "tool function Implementation not found, toolName : " + toolName
        );
    }
  }
}
