import { AI_ROLES_KEY, AI_TOOLS_KEY } from "../utils/service"
import prompts from '../../data/prompts.json';

export const useInitData = ( ) => {

    const roles = localStorage.getItem(AI_ROLES_KEY);
    if(!roles){
        console.log("roles not found, load the default roles....");
        localStorage.setItem(AI_ROLES_KEY, JSON.stringify(prompts));

    }

    const tools = localStorage.getItem(AI_TOOLS_KEY);
    if(!tools){
        console.log("tools not found, load the default tools....")
    }


}