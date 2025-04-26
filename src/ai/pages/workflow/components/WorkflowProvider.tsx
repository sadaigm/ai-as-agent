import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Workflow } from '../workflow.types';

interface WorkflowContextType {
    flowStateValue: any;
    setFlowStateValue: React.Dispatch<React.SetStateAction<any>>;
    nodeCallBack: (node: string) => void;
    createNewWorkflow: (workflow: Workflow) => void;
    currentWorkflowId?: string;
    setcurrentWorkflowId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const WorkflowProvider = ({ children }: { children: ReactNode }) => {
    const [currentWorkflow, setcurrentWorkflow] = useState<Workflow|null>(null);
    const [flowStateValue, setFlowStateValue] = useState<string|null>(null);
    const [currentWorkflowId, setcurrentWorkflowId] = useState<string | undefined>(undefined)
    const nodeCallBack = useCallback((node: string) => {
        console.log("Node callback", node);
        setFlowStateValue(node);
        // Handle node-specific logic here
      }, []);

      const createNewWorkflow = useCallback((workflow: Workflow) => {
        setcurrentWorkflow(workflow);
      }
      , []);

    return (
        <WorkflowContext.Provider value={{ flowStateValue, setFlowStateValue, nodeCallBack, createNewWorkflow, currentWorkflowId, setcurrentWorkflowId }}>
            {children}
        </WorkflowContext.Provider>
    );
};

export const useWorkflow = () => {
    const context = useContext(WorkflowContext);
    if (!context) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
};

export default WorkflowProvider;
