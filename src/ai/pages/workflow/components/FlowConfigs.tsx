import React from "react";
import { useWorkflow } from "./WorkflowProvider";
import { Empty } from "antd";

const FlowConfigs = () => {
  const { currentWorkflowId } = useWorkflow();

  return (
    <div>
      {currentWorkflowId ? (
        <div>
          <h3>Current Workflow ID: {currentWorkflowId}</h3>
        </div>
      ) : (
        <Empty description="No workflow element selected" />
      )}
    </div>
  );
};

export default FlowConfigs;
