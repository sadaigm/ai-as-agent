import { Tool } from "../../../../components/types/tool";
import { ToolOutlined } from "@ant-design/icons";
import SourceHandle from "../handle/SourceHandle";
import TargetHandle from "../handle/TargetHandle";
import { CSSProperties } from "styled-components";
import ConfigureIO from "../transformer/ConfigureIO";
import { NodeParams } from "../../workflow.types";
import { useWorkflow } from "../WorkflowProvider";

const ToolNode = (props: any) => {
  const tool: Tool = props.data.node;
  console.log(tool)
const { setcurrentWorkflowId,nodes,setNodes } = useWorkflow();
  const nodeParams: NodeParams = {
    input: props.data.input,
    output: props.data.output,
  };

  const handleUpdateNodeData = (updatedNodeData: NodeParams) => {
    console.log("Updated Node Data:", updatedNodeData,nodes);
    // Update the node data in the parent workflow or state
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            params: {
            input: updatedNodeData.input,
            output: updatedNodeData.output,
            }
          };
        }
        return node;
      });
    }
    );
  };

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
    setcurrentWorkflowId(props.id);
  }

  return (
    <div style={toolNodeStyle}>
      <TargetHandle />
      <div style={{ display: "flex", alignItems: "center", width: "100%" , flexDirection:"column"}} >
      <ToolOutlined />      
      <div style={{ padding: "5px", display:"flex", flexDirection:"column" }}>
        <strong style={{ textTransform: "capitalize", fontSize: "11px" }}>
        <strong>Tool:</strong> {`${tool.function.name}`}
        </strong>
        </div>
      </div>      
      <ConfigureIO
        data={tool}
        nodeParams={nodeParams}
        nodeType="toolNode"
        nodeId={props.id}
        onUpdateNodeData={handleUpdateNodeData}
      />
      <SourceHandle />
    </div>
  );
};

export default ToolNode;
