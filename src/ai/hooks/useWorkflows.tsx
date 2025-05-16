import { useState, useEffect } from "react";
import { getWorkflows, saveWorkflow, deleteWorkflow } from "../utils/service";
import { Workflow } from "../pages/workflow/workflow.types";

type WorkflowsHookReturnType = {
  errorMessage: string | null;
  workflows: Workflow[];
  saveWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
};

export const useWorkflows = (): WorkflowsHookReturnType => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getWorkflows()
      .then(setWorkflows)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const saveWorkflowHandler = (workflow: Workflow) => {
    const updatedWorkflows = workflows.filter((w) => w.id !== workflow.id);
    updatedWorkflows.push(workflow);
    setWorkflows(updatedWorkflows);
    saveWorkflow(workflow);
  };

  const deleteWorkflowHandler = (id: string) => {
    const updatedWorkflows = workflows.filter((workflow) => workflow.id !== id);
    setWorkflows(updatedWorkflows);
    deleteWorkflow(id);
  };

  return { errorMessage, workflows, saveWorkflow: saveWorkflowHandler, deleteWorkflow: deleteWorkflowHandler };
};