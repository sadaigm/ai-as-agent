import { Parameter, Tool } from "../components/types/tool";

export const getFuncParamsString = (tool: Tool) => {
  if (tool.type === "function") {
    return `${tool.function.name} (${getFuncParams(tool.function.parameters)})`;
  }
  return tool.function.name;
};
export const getFuncParams = (parameters: Parameter[]): string => {
  return `${parameters.map((p) => ` ${p.name}: ${p.type} `)}`;
};

export const getToolFullDescription = (tool: Tool) => {
  if (tool.function.parameters.length === 0) {
    return `Tool Name: ${tool.function.name} \n Tool Description:  ${tool.function.description} \n `;
  }
  return `Tool Name: ${tool.function.name} \n Tool Description:  ${
    tool.function.description
  } \n Tool Parameters: \n ${getFuncParams(tool.function.parameters)} \n`;
};
