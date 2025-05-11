import { Popover, Tree, Empty, Button } from "antd";
import React, { FC, useState } from "react";
import { NodeParams } from "../../workflow.types";
import {
    CheckOutlined,
  } from "@ant-design/icons";

type NodePickerProps = {
  treeData: any[]; // Data for the tree component
  textAreaRef: React.RefObject<any>; // Ref to the TextArea component
  setLocalNodeData: React.Dispatch<React.SetStateAction<NodeParams>>; // Function to update local node data
  localNodeData: NodeParams; // Local node data
};

const NodePicker: FC<NodePickerProps> = ({
  textAreaRef,
  localNodeData,
  setLocalNodeData,
  treeData,
}) => {
  const [treeVisible, setTreeVisible] = useState(false); // State to control tree popover visibility
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // State to track selected keys in the tree
  const handleInsertExpression = (expression: string) => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    if (textArea) {
      const cursorPosition = textArea.selectionStart;
      const currentValue = localNodeData.input?.userPrompt || "";
      const newValue =
        currentValue.slice(0, cursorPosition) +
        expression +
        currentValue.slice(cursorPosition);
      setLocalNodeData((prev) => ({
        ...prev,
        input: { ...prev.input, userPrompt: newValue },
      }));
    }
    setTreeVisible(false); // Close the tree popover
    setSelectedKeys([]); // Reset the selected keys
  };
  return (
    <>
      {treeData.length > 0 && (
        <div style={{ width: "15%" }}>
          <Popover
            placement="leftTop"
            content={
              treeData.length > 0 ? (
                <Tree
                  showIcon
                  treeData={treeData}
                  selectedKeys={selectedKeys} // Bind selected keys to state
                  onSelect={(keys) => {
                    if (keys.length > 0) {
                      handleInsertExpression(keys[0] as string);
                    }
                  }}
                />
              ) : (
                <Empty description="No parameters available" />
              )
            }
            title="Select Parameter"
            trigger="click"
            visible={treeVisible}
            onVisibleChange={(visible) => {
              setTreeVisible(visible);
              if (visible) {
                setSelectedKeys([]); // Reset selected keys when popover opens
              }
            }}
          >
            <Button
              size="small"
              style={{ marginLeft: "8px" }}
              icon={<CheckOutlined />}
            >
              Pick
            </Button>
          </Popover>
        </div>
      )}
    </>
  );
};

export default NodePicker;
