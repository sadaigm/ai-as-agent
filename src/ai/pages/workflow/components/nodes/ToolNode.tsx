import React from "react";
import { Tool } from "../../../../components/types/tool";
import { Handle, Position } from "reactflow";
import SourceHandle from "../handle/SourceHandle";
import TargetHandle from "../handle/TargetHandle";
import { CSSProperties } from "styled-components";

const ToolNode = (props: any) => {
  console.log({ props });
  const tool: Tool = props.data.data;
  const isConnectable = props.isConnectable;
  console.log({ tool });
  const toolNodeStyle: CSSProperties = {
    border: "1px solid #52c41a",
    borderRadius: "5px",
    background: "#f6ffed",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "250px",
    height: "100px",
  };
  if (props.selected) {
    toolNodeStyle.boxShadow = "0 0 6px #52c41a";
  }
  return (
    <div style={toolNodeStyle}>
      <TargetHandle />
      <strong>Tool:</strong>
      <div>{tool.function.name}</div>
      <SourceHandle />
    </div>
  );
};

export default ToolNode;
