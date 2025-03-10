import { SystemRolePrompt, Tool, AIAgent } from "../components/types/tool";

export const AI_TOOLS_KEY = "aitools";
export const AI_ROLES_KEY = "aisysprompts";
export const AI_AGENTS_KEY = "aiagents";

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

export const deleteSystemPromptTemplate = (id: string) => {
  const data = localStorage.getItem(AI_ROLES_KEY);
  if (data) {
    const systemRolePrompts = JSON.parse(data) as SystemRolePrompt[];
    const updatedPrompts = systemRolePrompts.filter(prompt => prompt.id !== id);
    localStorage.setItem(AI_ROLES_KEY, JSON.stringify(updatedPrompts));
  }
};

export const getAgents = (): Promise<AIAgent[]> => {
  const data = localStorage.getItem(AI_AGENTS_KEY);
  if (data) {
    return Promise.resolve(JSON.parse(data) as AIAgent[]);
  }
  return Promise.resolve([] as AIAgent[]);
};

export const saveAgents = (agents: AIAgent[]) => {
  localStorage.setItem(AI_AGENTS_KEY, JSON.stringify(agents));
};

export const deleteAgent = (name: string) => {
  const data = localStorage.getItem(AI_AGENTS_KEY);
  if (data) {
    const agents = JSON.parse(data) as AIAgent[];
    const updatedAgents = agents.filter(agent => agent.name !== name);
    localStorage.setItem(AI_AGENTS_KEY, JSON.stringify(updatedAgents));
  }
};

