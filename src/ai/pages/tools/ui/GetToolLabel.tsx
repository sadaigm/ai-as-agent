import React, { FC } from "react";
import { Tool } from "../../../components/types/tool";
import { FunctionOutlined, ApiOutlined } from "@ant-design/icons";
import { getFuncParams } from "../../../utils/function";
import useScreenSize from "../../../hooks/useScreenSize";

type GetToolLabelProps = {
  tool: Tool;
  showParams?: boolean;
};

const GetToolLabel: FC<GetToolLabelProps> = ({ tool,showParams }) => {
    const {screenSize } =useScreenSize();

    let styleObj = {};
    if(screenSize === 'mobile'){
        styleObj = {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        }
    }

  return (
    <>
      {
        <span  style={styleObj} >
          {tool.type !== "rest" ? (
            <FunctionOutlined style={{ color: "#ff5722" }} />
          ) : (
            <ApiOutlined style={{ color: "#2196f3" }} />
          )}
          <strong
            style={{
              textTransform: "capitalize",
              marginLeft: "5px",
            }}
          >
            {`${tool.function.name}`}
          </strong>
          {showParams && <span>  {`( ${getFuncParams(tool.function.parameters)} )`}</span>}
        </span>
      }
    </>
  );
};

export default GetToolLabel;

type GetToolIconProps = {
  type: string;
};

export const GetToolIcon:FC<GetToolIconProps> = ({type}) => {
  return type !== "rest" ? (
    <FunctionOutlined style={{ color: "#ff5722" }} />
  ) : (
    <ApiOutlined style={{ color: "#2196f3" }} />
  );
}
