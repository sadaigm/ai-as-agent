import { SystemRolePrompt, Tool, AIAgent } from "../components/types/tool";
import { Environment } from "../components/types/environment";
import { Workflow } from "../pages/workflow/workflow.types";

export const AI_TOOLS_KEY = "aitools";
export const AI_ROLES_KEY = "aisysprompts";
export const AI_AGENTS_KEY = "aiagents";
export const ENVIRONMENTS_KEY = "environments";
export const DEFAULT_AI = "defaultAI";
export const WORKFLOWS_KEY = "workflows";

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

// New functions for environments
export const getEnvironments = (): Promise<Environment[]> => {
  const data = localStorage.getItem(ENVIRONMENTS_KEY);
  if (data) {
    return Promise.resolve(JSON.parse(data) as Environment[]);
  }
  return Promise.resolve([] as Environment[]);
};

export const saveEnvironments = (environments: Environment[]) => {
  localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify(environments));
};

export const deleteEnvironmentByName = (name: string) => {
  const data = localStorage.getItem(ENVIRONMENTS_KEY);
  if (data) {
    const environments = JSON.parse(data) as Environment[];
    const updatedEnvironments = environments.filter(env => env.name !== name);
    localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify(updatedEnvironments));
  }
};

export const saveDefaultAI = (defaultAI: Environment) => {
  localStorage.setItem(DEFAULT_AI, JSON.stringify(defaultAI));
};

export const getDefaultAI = (): Environment | undefined => {
  const data = localStorage.getItem(DEFAULT_AI);
  if (data) {
    return JSON.parse(data) as Environment;
  }
  return undefined;
}



// Save a workflow
export const saveWorkflow = (workflow: Workflow) => {
  const data = localStorage.getItem(WORKFLOWS_KEY);
  const workflows = data ? (JSON.parse(data) as Workflow[]) : [];
  // Check if the workflow already exists
  const existingWorkflowIndex = workflows.findIndex(w => w.id === workflow.id);
  if (existingWorkflowIndex !== -1) {
    // Update the existing workflow
    workflows[existingWorkflowIndex] = workflow;
  } else {
    // Add a new workflow
    workflows.push(workflow);
  }
  // Save the workflow to local storage  
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
};

// Get all workflows
export const getWorkflows = (): Promise<Workflow[]> => {
  const data = localStorage.getItem(WORKFLOWS_KEY);
  if (data) {
    return Promise.resolve(JSON.parse(data) as Workflow[]);
  }
  return Promise.resolve([] as Workflow[]);
};

// Delete a workflow by ID
export const deleteWorkflow = (id: string) => {
  const data = localStorage.getItem(WORKFLOWS_KEY);
  if (data) {
    const workflows = JSON.parse(data) as Workflow[];
    const updatedWorkflows = workflows.filter((workflow) => workflow.id !== id);
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(updatedWorkflows));
  }
};