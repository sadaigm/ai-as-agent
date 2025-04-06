import React, { useEffect, useState } from "react";
import { List, Card, Button, message, Modal, Input, Space, Steps } from "antd";
import { getWorkflows, deleteWorkflow } from "../../utils/service";
import { Workflow } from "./workflow.types";
import WorkflowAI from "./WorkflowAI";

const { Step } = Steps;

const WorkflowAIList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");

  // Fetch workflows on component mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    const data = await getWorkflows();
    setWorkflows(data);
  };

  const handleDelete = async (id: string) => {
    deleteWorkflow(id);
    message.success("Workflow deleted successfully!");
    loadWorkflows(); // Reload workflows after deletion
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!workflowName) {
        message.error("Please provide a workflow name.");
        return;
      }
      setCurrentStep(1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setWorkflowName("");
    setWorkflowDescription("");
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "1rem" }}
      >
        New Workflow
      </Button>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={workflows}
        renderItem={(workflow) => (
          <List.Item>
            <Card
              title={workflow.name}
              actions={[
                <Button
                  type="link"
                  onClick={() =>
                    message.info(`Edit workflow with ID: ${workflow.id}`)
                  }
                >
                  Edit
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(workflow.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <p>{workflow.description || "No description provided."}</p>
            </Card>
          </List.Item>
        )}
      />

      <>
        {isModalVisible && (
          <WorkflowAI
            handleClose={handleClose}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />
        )}
      </>
    </div>
  );
};

export default WorkflowAIList;
