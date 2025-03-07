import { useState, useEffect } from "react";
import { getAgents, saveAgents, deleteAgent } from "../utils/service";
import { AIAgent } from "../components/types/tool";

type AgentsHookReturnType = {
  errorMessage: any;
  agents: AIAgent[];
  saveAgent: (agent: AIAgent) => void;
  deleteAgent: (name: string) => void;
};

export const useAgents = (): AgentsHookReturnType => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAgents()
      .then(setAgents)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const saveAgent = (agent: AIAgent) => {
    const updatedAgents = agents.filter((a) => a.name !== agent.name);
    updatedAgents.push(agent);
    setAgents(updatedAgents);
    saveAgents(updatedAgents);
  };

  const deleteAgentByName = (name: string) => {
    const updatedAgents = agents.filter((agent) => agent.name !== name);
    setAgents(updatedAgents);
    deleteAgent(name);
  };

  return { errorMessage, agents, saveAgent, deleteAgent: deleteAgentByName };
};