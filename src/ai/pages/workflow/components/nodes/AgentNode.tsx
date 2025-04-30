import { AIAgent } from "../../../../components/types/tool";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useWorkflow } from "../WorkflowProvider";
import { getRandomColor } from "../../../../utils/ui-utils";
import SourceHandle from "../handle/SourceHandle";
import TargetHandle from "../handle/TargetHandle";
import { CSSProperties } from "styled-components";
import ConfigureIO from "../transformer/ConfigureIO";
import { NodeParams } from "../../workflow.types";

const AgentNode = (props: any) => {
  const agent: AIAgent = props.data.data;
  
  const { currentWorkflowId, setcurrentWorkflowId, currentWorkflow, edges, nodes } = useWorkflow();
  console.log({props, currentWorkflowId, currentWorkflow, edges, nodes});
  
  const nodeParams: NodeParams = {
    input: props.data.input,
    output: props.data.output,
  };

  const handleUpdateNodeData = (updatedNodeData: NodeParams) => {
    console.log("Updated Node Data:", updatedNodeData);
    // Update the node data in the parent workflow or state
  };

  const agentNodeStyle: CSSProperties = {
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
  };

  if (props.selected) {
    agentNodeStyle.boxShadow = "0 0 6px #03A9F4";
    setcurrentWorkflowId(props.id);
  } else if (currentWorkflowId === props.id) {
    setcurrentWorkflowId(undefined);
  }

  return (
    <div style={agentNodeStyle}>
      <TargetHandle />
      <div style={{ display: "flex", alignItems: "center", width: "100%" , flexDirection:"column"}} >
        <div style={{  display:"flex", justifyContent:"center",  }}>
        <ThunderboltOutlined style={{ color: getRandomColor() || "#2196f3",   }} />
        </div>
        <div style={{ padding: "5px", display:"flex", flexDirection:"column" }}>
        <strong style={{ textTransform: "capitalize", fontSize: "11px" }}>
          {`${agent.name}`}
        </strong>
        </div>
        
        
      </div>
      <ConfigureIO
          data={agent}
          nodeParams={nodeParams}
          nodeType="agentNode"
          nodeId={props.id}
          onUpdateNodeData={handleUpdateNodeData}
        />
      <SourceHandle />
    </div>
  );
};

export default AgentNode;
