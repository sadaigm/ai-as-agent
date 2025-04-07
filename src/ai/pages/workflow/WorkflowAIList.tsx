import React, { useEffect, useState } from "react";
import { List, Card, Button, message } from "antd";
import { getWorkflows, deleteWorkflow } from "../../utils/service";
import { Workflow } from "./workflow.types";
import WorkflowAI from "./WorkflowAI";

const WorkflowAIList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);

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

  const handleEdit = (workflow: Workflow) => {
    setCurrentWorkflow(workflow); // Set the selected workflow
    setIsModalVisible(true); // Open the modal
  };

  const handleNewWorkflow = () => {
    setCurrentWorkflow(null); // Clear the current workflow for a new workflow
    setIsModalVisible(true); // Open the modal
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setCurrentWorkflow(null); // Clear the current workflow when the modal is closed
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={handleNewWorkflow}
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
                  onClick={() => handleEdit(workflow)}
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

      {isModalVisible && (
        <WorkflowAI
          handleClose={handleClose}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          defaultWorkflow={currentWorkflow} // Pass the selected workflow as defaultWorkflow
          saveCallback={loadWorkflows} // Callback to refresh the workflow list after saving
        />
      )}
    </div>
  );
};

export default WorkflowAIList;
