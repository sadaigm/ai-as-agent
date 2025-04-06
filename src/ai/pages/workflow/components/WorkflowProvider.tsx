import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface WorkflowContextType {
    flowStateValue: any;
    setFlowStateValue: React.Dispatch<React.SetStateAction<any>>;
    nodeCallBack: (node: string) => void;

}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const WorkflowProvider = ({ children }: { children: ReactNode }) => {
    const [flowStateValue, setFlowStateValue] = useState<string|null>(null);
    const nodeCallBack = useCallback((node: string) => {
        console.log("Node callback", node);
        setFlowStateValue(node);
        // Handle node-specific logic here
      }, []);

    return (
        <WorkflowContext.Provider value={{ flowStateValue, setFlowStateValue, nodeCallBack }}>
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
