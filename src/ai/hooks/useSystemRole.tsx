import { useEffect, useState } from "react";
import { SystemRolePrompt, Tool } from "../components/types/tool";
import {
  getSystemPromptTemplates,
  getTools,
  saveSystemPromptTemplates,
  saveTools,
} from "../utils/service";

type SystemRoleHookReturnType = {
  errorMessage: any;
  systemRolePrompts: SystemRolePrompt[];
  saveSystemRolePrompt: (systemRolePrompt: SystemRolePrompt) => void;
};

export const useSystemRole = (): SystemRoleHookReturnType => {
  const [systemRolePrompts, setSystemRolePrompts] = useState<
    SystemRolePrompt[]
  >([]);
  const [errorMessage, seterrorMessage] = useState(undefined);

  useEffect(() => {
    getSystemPromptTemplates()
      .then((sysRoles) => {
        setSystemRolePrompts(sysRoles);
      })
      .catch((error) => {
        console.error("Error fetching tools", error);
        seterrorMessage(error);
      });
  }, []);

  const saveSystemRolePrompt = (systemRolePrompt: SystemRolePrompt) => {
    const updated = [...systemRolePrompts, systemRolePrompt];
    setSystemRolePrompts(updated);
    saveSystemPromptTemplates(updated);
  };
  return { errorMessage, systemRolePrompts, saveSystemRolePrompt };
};
