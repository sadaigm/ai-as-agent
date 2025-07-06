import React, { useEffect, useState } from "react";
import { List, Card, Button, message, Modal, Input } from "antd";
import { useWorkflows } from "../../hooks/useWorkflows";
import RunWorkflow from "./components/execute/RunWorkflow";
import { Workflow } from "./workflow.types";

const { Search } = Input;

const WorkflowAIList: React.FC = () => {
  const { workflows, saveWorkflow, deleteWorkflow } = useWorkflows();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [isRunModalVisible, setIsRunModalVisible] = useState(false);

  const [filtered, setFiltered] = useState(workflows);

  useEffect(() => {
    setFiltered(workflows);
  }, [workflows]);

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
    message.success("Workflow deleted successfully!");
  };

  const handleEdit = (workflow: Workflow) => {
    window.location.assign(`/workflow-ai-open/${workflow.id}`); // Navigate to the workflow editor
  };

  const handleNewWorkflow = () => {
    window.location.assign(`/workflow-ai-open/NEW`); // Navigate to create a new workflow
  };

  const handleExecute = (workflow: Workflow) => {
    const clonedWorkflow = JSON.parse(JSON.stringify(workflow));
    setSelectedWorkflow(clonedWorkflow);
    setIsRunModalVisible(true); // Open the run workflow modal
  };

  const handleRunModalClose = () => {
    setIsRunModalVisible(false);
    setSelectedWorkflow(null);
  };

  const onSearch = (value: string) => {
    console.log(value);
    if (value === "") {
      setFiltered(workflows);
      return;
    }
    if (value.length > 2) {
      const filteredAgents = workflows.filter((workflow) => {
        return workflow.name.toLowerCase().includes(value.toLowerCase());
      });
      setFiltered(filteredAgents);
    }
  };

  return (
    <div>
      <div
        style={{
          height: "50px",
          display: "flex",
          padding: "10px",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            type="primary"
            onClick={handleNewWorkflow}
            style={{ marginBottom: "1rem" }}
          >
            New Workflow
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "70px" }}>
            <span> Total: {filtered.length}</span>
          </div>
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="middle"
            onSearch={onSearch}
          />
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filtered}
        renderItem={(workflow) => (
          <List.Item>
            <Card
              title={workflow.name}
              actions={[
                <Button type="link" onClick={() => handleEdit(workflow)}>
                  Edit
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(workflow.id)}
                >
                  Delete
                </Button>,
                <Button type="link" onClick={() => handleExecute(workflow)}>
                  Execute
                </Button>,
              ]}
            >
              <p>{workflow.description || "No description provided."}</p>
            </Card>
          </List.Item>
        )}
      />
      {isRunModalVisible && selectedWorkflow ? (
        <RunWorkflow
          workflow={selectedWorkflow}
          isRunModalVisible={isRunModalVisible}
          onClose={handleRunModalClose}
        />
      ) : null}
    </div>
  );
};

export default WorkflowAIList;
