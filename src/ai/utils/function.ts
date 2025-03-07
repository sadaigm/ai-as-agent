import { Parameter, Tool } from "../components/types/tool";

export const getFuncParamsString = (tool: Tool) => {    

    if(tool.type === 'function'){
        
        return `${tool.function.name} (${getFuncParams(tool.function.parameters)})`
    }
    return tool.function.name;

}
export const getFuncParams = (parameters: Parameter[]): string => {

    return `${parameters.map(p => ` ${p.name}: ${p.type} `)}`;
}