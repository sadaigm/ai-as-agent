import React from "react";
import { Handle, Position } from "reactflow";
import SourceHandle from "../handle/SourceHandle";
import { CSSProperties } from "styled-components";

const StartNode = (props: any) => {
  const tool: any = props.data.node;
  const startNodeStyle :CSSProperties = {
    height: "50px",
    width: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    // padding: "10px",
    border: "1px solid #FF9800",
    borderRadius: "50%",
    background: "#fff5d8",
    textAlign: "center",
    textTransform: "capitalize",
  };

  if (props.selected) {
    startNodeStyle.boxShadow = "0 0 5px #FF9800";
  }
  return (
    
    <div
      style={startNodeStyle}
    >
      <div>Start</div>
      <SourceHandle />
    </div>    
  );
};

export default StartNode;
