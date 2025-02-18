import { SystemRolePrompt, Tool } from "../components/types/tool";

export const AI_TOOLS_KEY = "aitools";
export const AI_ROLES_KEY = "aisysprompts";
export const getTools = (): Promise<Tool[]> => {
  
  const data = localStorage.getItem(AI_TOOLS_KEY);
  if (data) {
    return Promise.resolve(JSON.parse(data) as Tool[]);
  }
  return Promise.resolve([] as Tool[]);
};

export const getSystemPromptTemplates = () => {
  const data = localStorage.getItem(AI_ROLES_KEY);
  if (data) {
    return Promise.resolve(JSON.parse(data) as SystemRolePrompt[]);
  }
  return Promise.resolve([] as SystemRolePrompt[]);
};

export const saveTools = (tools: Tool[]) => {
  localStorage.setItem(AI_TOOLS_KEY, JSON.stringify(tools));
};

export const saveSystemPromptTemplates = (systemRolePrompts: SystemRolePrompt[]) => {
  localStorage.setItem(AI_ROLES_KEY, JSON.stringify(systemRolePrompts));
};

