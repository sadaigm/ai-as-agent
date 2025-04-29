import React, { useEffect, useState } from "react";
import { List, Card, Button, message } from "antd";
// import { useNavigate } from "react-router-dom";
import { getWorkflows, deleteWorkflow } from "../../utils/service";
import { Workflow } from "./workflow.types";

const WorkflowAIList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  // const navigate = useNavigate();

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
    window.location.assign(`/workflow-ai-open/${workflow.id}`); // Navigate to the workflow editor
  };

  const handleNewWorkflow = () => {
    window.location.assign(`/workflow-ai-open/NEW`); // Navigate to create a new workflow
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
    </div>
  );
};

export default WorkflowAIList;
