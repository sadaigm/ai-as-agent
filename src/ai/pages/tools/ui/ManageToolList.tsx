import React, { FC } from "react";
import { Tool } from "../../../components/types/tool";
import { List, Button } from "antd";
import GetToolLabel from "./GetToolLabel";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./managetool.css"

type GetToolListProps = {
  tools: Tool[];
  enabledTools?: Tool[];
  showAdd?: boolean;
  showRemove?: boolean;
  handleRemove?: (tool: Tool) => void;
  handleToolSelect?: (tool: Tool) => void;
  pageSize?: number;
  maxHeight?: number;
};

const ManageToolList: FC<GetToolListProps> = ({
  tools,
  showAdd,
  showRemove,
  handleRemove,
  handleToolSelect,
  enabledTools,
  pageSize,
  maxHeight,
}) => {
  const getActions = (tool: Tool) => {
    const actions = [];
    if (showRemove) {
      actions.push(
        <Button
          color="danger"
          variant="outlined"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => {
            handleRemove && handleRemove(tool);
          }}
        ></Button>
      );
    }
    if (showAdd && enabledTools) {
      actions.push(
        <Button
          disabled={
            enabledTools.findIndex(
              (t) => t.function.name === tool.function.name
            ) > -1
          }
          color="primary"
          variant="outlined"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => {
            handleToolSelect && handleToolSelect(tool);
          }}
        ></Button>
      );
    }
    return actions;
  };

  function getToolStyle(tool: Tool): React.CSSProperties | undefined {
    if (
      enabledTools &&
      enabledTools.findIndex((t) => t.function.name === tool.function.name) > -1
    ) {
      return {
        opacity: 0.4,
      };
    }
  }

  return (
    <List
      size="small"
      className="manage__tool-list"
      bordered
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: pageSize || 3,
      }}
      style={{
        marginTop: "16px",
        maxHeight: `${maxHeight ? maxHeight + "px" : "auto"}`,
        overflowY: `${maxHeight ? "clip" : "auto"}`,
      }}
      dataSource={tools}
      renderItem={(tool) => (
        <List.Item actions={getActions(tool)}>
          <List.Item.Meta
            style={getToolStyle(tool)}
            title={<GetToolLabel tool={tool} showParams />}
            description={
              <span
                style={{
                  maxHeight: `${maxHeight ? maxHeight * 0.75 + "px" : "auto"}`,
                  overflowY: `${maxHeight ? 'clip' : "auto"}`,
                }}
              >
                {tool.function.description}
              </span>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ManageToolList;
