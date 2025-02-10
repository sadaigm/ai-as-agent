import { SystemRolePrompt, Tool } from "../components/types/tool";

export const getTools= (): Tool[] => {
    const data = localStorage.getItem("aitools");
    if(data){
      return JSON.parse(data) as Tool[];
    }
    return [] as Tool[];    
  }

  export const getSystemPromptTemplates = () => {
    const data = localStorage.getItem("aisysprompts");
    if(data){
      return JSON.parse(data) as SystemRolePrompt[];
    }
    return [] as SystemRolePrompt[];    
  }