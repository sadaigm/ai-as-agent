import React, { useContext } from "react";
import { AIAgent } from "../../../../components/types/tool";
import { Handle, Position } from "reactflow";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useWorkflow } from "../WorkflowProvider";
import { getRandomColor } from "../../../../utils/ui-utils";
import SourceHandle from "../handle/SourceHandle";
import TargetHandle from "../handle/TargetHandle";

const AgentNode = (props: any) => {
  console.log({ props });
  const agent: AIAgent = props.data.data;
  const { direction } = props.data;
  const { nodeCallBack } = useWorkflow();

  return (
    <div
      key={direction}
      style={{
        // padding: "10px",
        border: "1px solid #1890ff",
        borderRadius: "5px",
        background: "#e6f7ff",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "250px",
        height: "100px",
      }}
    >
      {/* Left Handle for incoming connections */}
      {/* <Handle
        style={{
          background: "#1890ff",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
        }}
        type="target"
        position={Position.Top}
        isConnectable={true}
      /> */}
      <TargetHandle />
      
      <span>
        <UserOutlined style={{ color: getRandomColor() || "#2196f3" }} />
        <strong
          style={{
            textTransform: "capitalize",
            marginLeft: "8px",
          }}
        >
          {`${agent.name}`}
        </strong>
      </span>
      {/* Right Handle for outgoing connections */}
      {/* <Handle type="source" position={Position.Bottom} isConnectable={true} /> */}
      <SourceHandle />
    </div>
  );
};

export default AgentNode;
