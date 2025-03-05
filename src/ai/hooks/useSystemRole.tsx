import { useState, useEffect } from "react";
import { SystemRolePrompt } from "../components/types/tool";
import {
  getSystemPromptTemplates,
  saveSystemPromptTemplates,
  deleteSystemPromptTemplate,
} from "../utils/service";

export const useSystemRole = () => {
  const [systemRolePrompts, setSystemRolePrompts] = useState<
    SystemRolePrompt[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getSystemPromptTemplates()
      .then(setSystemRolePrompts)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const saveSystemRolePrompt = (prompt: SystemRolePrompt) => {
    const updatedPrompts = [...systemRolePrompts];
    const index = updatedPrompts.findIndex((p) => p.id === prompt.id);
    if (index > -1) {
      updatedPrompts[index] = prompt;
    } else {
      updatedPrompts.push(prompt);
    }
    setSystemRolePrompts(updatedPrompts);
    saveSystemPromptTemplates(updatedPrompts);
  };

  const deleteSystemRolePrompt = (id: string) => {
    const updatedPrompts = systemRolePrompts.filter(
      (prompt) => prompt.id !== id
    );
    setSystemRolePrompts(updatedPrompts);
    deleteSystemPromptTemplate(id);
  };

  return {
    systemRolePrompts,
    saveSystemRolePrompt,
    deleteSystemRolePrompt,
    errorMessage,
  };
};
