import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Workflow } from '../workflow.types';
import { useEdgesState, useNodesState } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getWorkflows } from '../../../utils/service';

interface WorkflowContextType {
    flowStateValue: any;
    setFlowStateValue: React.Dispatch<React.SetStateAction<any>>;
    nodeCallBack: (node: string) => void;
    createNewWorkflow: (workflow: Workflow) => void;
    currentWorkflowId?: string;
    setcurrentWorkflowId: React.Dispatch<React.SetStateAction<string | undefined>>;
    currentWorkflow: Workflow | null;
    workflowName: string;
    setWorkflowName: React.Dispatch<React.SetStateAction<string>>;
    workflowDescription: string;
    setWorkflowDescription: React.Dispatch<React.SetStateAction<string>>;
    globalVariables: Record<string, string>;
    setGlobalVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    nodes: any[];
    setNodes: React.Dispatch<React.SetStateAction<any[]>>;
    onNodesChange: (changes: any[]) => void;
    edges: any[];
    setEdges: React.Dispatch<React.SetStateAction<any[]>>;
    onEdgesChange: (changes: any[]) => void;    
    workflowId?: string;
    setworkflowId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const WorkflowProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [currentWorkflow, setcurrentWorkflow] = useState<Workflow|null>(null);
    const [flowStateValue, setFlowStateValue] = useState<string|null>(null);
    const [currentWorkflowId, setcurrentWorkflowId] = useState<string | undefined>(undefined);
    const [workflowId, setworkflowId] = useState<string | undefined>(undefined);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
      const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [workflowName, setWorkflowName] = useState("");
      const [workflowDescription, setWorkflowDescription] = useState("");
      const [globalVariables, setGlobalVariables] = useState<Record<string, string>>({});

      useEffect(() => {
        

          function initializeWorkflow() {
              if (workflowId === "NEW") {
                  // Initialize a new workflow
                  setWorkflowName("");
                  setWorkflowDescription("");
                  setNodes([]);
                  setEdges([]);
                  setGlobalVariables({});
              } else {
                  // Load an existing workflow
                  const loadWorkflow = async () => {
                      const workflows = await getWorkflows();
                      const workflow = workflows.find((w) => w.id === workflowId);
                      if (workflow) {
                          setWorkflowName(workflow.name);
                          setWorkflowDescription(workflow.description);
                          setNodes(workflow.nodes || []);
                          setEdges(workflow.edges || []);
                          setGlobalVariables(workflow.globalVariables || {});
                      } else {
                          message.error("Workflow not found!");
                          navigate("/workflow-ai"); // Redirect to the workflow list if not found
                      }
                  };
                  loadWorkflow();
              }
          }
          if(workflowId){
            initializeWorkflow();
          }
          
      }, [workflowId, navigate]);
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
        <WorkflowContext.Provider value={{ flowStateValue, setFlowStateValue, nodeCallBack, createNewWorkflow, currentWorkflowId, setcurrentWorkflowId, 
        currentWorkflow,
        workflowName, setWorkflowName, workflowDescription, setWorkflowDescription, globalVariables, setGlobalVariables,
        nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange,
        workflowId, setworkflowId,
         }}>
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
