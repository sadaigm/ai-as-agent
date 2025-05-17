import { Modal, Input, Empty } from "antd";
import React, { FC } from "react";
import { getExecutionNodes, getNodeInput, getNodeName } from "./ExecutorUtils";
import { WorkflowNode } from "../../workflow.types";

type RuntimeParametersProps = {
  executionNodes: WorkflowNode[];
  isParamModalVisible: boolean;
  setIsParamModalVisible: (visible: boolean) => void;
  nodeParams: Record<string, any>;
  setNodeParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleCancel: () => void;
  handleSubmitParams: () => void;
  globalVariableParams: Record<string, any>;
  setGlobalVariableParams: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
};

const RuntimeParameters: FC<RuntimeParametersProps> = ({
  executionNodes,
  isParamModalVisible,
  setIsParamModalVisible,
  nodeParams,
  setNodeParams,
  handleCancel,
  handleSubmitParams,
  globalVariableParams,
  setGlobalVariableParams,
}) => {
  const activeWorkflowNodes = getExecutionNodes(executionNodes);
  console.log(executionNodes, activeWorkflowNodes);
  return (
    <Modal
      title={`Runtime Parameters`}
      visible={isParamModalVisible}
      onCancel={() => {
        handleCancel();
        setIsParamModalVisible(false);
      }}
      onOk={() => handleSubmitParams()}
    >
      <div>
        <p>
        <strong>Global Variables:</strong>
      </p>
      <div style={{ border: "1px solid #e4d6d654", padding: "10px", borderRadius: "5px" }}>
        {Object.entries(globalVariableParams).length > 0 ?Object.entries(globalVariableParams).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong>

            <Input.TextArea
              rows={2}
              placeholder="Enter Global Variable"
              value={value}
              onChange={(e) =>
                setGlobalVariableParams((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            ></Input.TextArea>
          </p>
        )):
        <Empty
          description={
            <span>
              No Global Variables
            </span>
          }
        />
        }
      </div>
      </div>

      {activeWorkflowNodes.filter((s,index) => index < 1 ).map((currentNode) => (
        <>
          <p>
            <strong>Node Name:</strong> {getNodeName(currentNode)}
          </p>
          <Input.TextArea
            rows={4}
            placeholder="Enter parameters as JSON"
            value={getNodeInput(currentNode, nodeParams)}
            onChange={(e) =>
              setNodeParams((prev) => ({
                ...prev,
                [currentNode?.id || ""]: {
                  ...prev[currentNode?.id || ""],
                  input: { userPrompt: e.target.value },
                },
              }))
            }
          />
        </>
      ))}
    </Modal>
  );
};

export default RuntimeParameters;
