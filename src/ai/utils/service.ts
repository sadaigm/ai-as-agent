import { SystemRolePrompt, Tool } from "../components/types/tool";

export const getTools = (): Promise<Tool[]> => {
  const data = localStorage.getItem("aitools");
  if (data) {
    return Promise.resolve(JSON.parse(data) as Tool[]);
  }
  return Promise.resolve([] as Tool[]);
};

export const getSystemPromptTemplates = () => {
  const data = localStorage.getItem("aisysprompts");
  if (data) {
    return Promise.resolve(JSON.parse(data) as SystemRolePrompt[]);
  }
  return Promise.resolve([] as SystemRolePrompt[]);
};

export const saveTools = (tools: Tool[]) => {
  localStorage.setItem("aitools", JSON.stringify(tools));
};

export const saveSystemPromptTemplates = (systemRolePrompts: SystemRolePrompt[]) => {
  localStorage.setItem("aisysprompts", JSON.stringify(systemRolePrompts));
};

