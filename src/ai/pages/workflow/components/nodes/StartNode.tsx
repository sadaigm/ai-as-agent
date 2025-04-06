import React from "react";
import { Handle, Position } from "reactflow";
import SourceHandle from "../handle/SourceHandle";

const StartNode = ({ data }: any) => {
  const tool: any = data.data;
  return (
    
    <div
      style={{
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
      }}
    >
      <div>Start</div>
      <SourceHandle />
    </div>    
  );
};

export default StartNode;
