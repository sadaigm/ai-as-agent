import { Popover, Tree, Empty, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import React, { FC, useEffect, useRef, useState } from "react";
import { ConfigureIOProps } from "./ConfigureIO";
import { NodeParams } from "../../workflow.types";

type ExpressionFieldProps = ConfigureIOProps & {
  treeData: any[];
  fieldKey: string; // Key to identify the field
};

const ExpressionField: FC<ExpressionFieldProps> = ({
  nodeType,
  nodeId,
  data,
  nodeParams,
  onUpdateNodeData,
  treeData,
  fieldKey,
}) => {
  const textAreaRef = useRef<any>(null); // Ref for the TextArea to manage cursor position
  const [localNodeData, setLocalNodeData] = useState<NodeParams>(nodeParams);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // State to track selected keys in the tree
  const [treeVisible, setTreeVisible] = useState(false); // State to control tree popover visibility


  useEffect(() => {
    onUpdateNodeData(localNodeData); // Pass updated data back to the parent
  }
  , [localNodeData]);  

  const handleInsertExpression = (expression: string) => {
    console.log(expression)
    if(!(expression.includes("{{") && expression.includes("}}"))){
        return;
    }
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    if (textArea) {
      const cursorPosition = textArea.selectionStart;
      const currentValue = localNodeData.input?.[fieldKey] || "";
      const newValue =
        currentValue.slice(0, cursorPosition) +
        expression +
        currentValue.slice(cursorPosition);
      setLocalNodeData((prev) => ({
        ...prev,
        input: { ...prev.input, [fieldKey]: newValue },
      }));
    }
    setTreeVisible(false); // Close the tree popover
    setSelectedKeys([]); // Reset the selected keys
  };
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <TextArea
        ref={textAreaRef}
        rows={4}
        value={localNodeData.input?.[fieldKey] || ""}
        onChange={(e) =>
          setLocalNodeData((prev) => ({
            ...prev,
            input: { ...prev.input, [fieldKey]: e.target.value },
          }))
        }
      />
      {treeData.length > 0 && (
        <div style={{ width: "15%" }}>
          <Popover
            placement="leftTop"
            content={
              treeData.length > 0 ? (
                <Tree
                  showIcon
                  defaultExpandAll
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
    </div>
  );
};

export default ExpressionField;
