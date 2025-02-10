import { Parameter, Tool } from "../components/types/tool";

export const getFuncParamsString = (tool: Tool) => {

    const getParams = (parameters: Parameter[]): string => {

        return `${parameters.map(p => ` ${p.name}: ${p.type} `)}`;
    }

    if(tool.type === 'function'){
        
        return `${tool.function.name} (${getParams(tool.function.parameters)})`
    }
    return tool.function.name;

}