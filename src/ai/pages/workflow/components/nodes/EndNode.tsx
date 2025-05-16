import React from 'react'
import { Handle, Position } from 'reactflow';
import TargetHandle from '../handle/TargetHandle';
import { CSSProperties } from 'styled-components';

const EndNode = (props: any) => {
    const tool: any = props.data.data;
    const endNodeStyle : CSSProperties = {
        height: "50px",
        width: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "10px",
        // padding: "10px",
        border: "1px solid #9E9E9E",
        borderRadius: "50%",
        background: "#e9e9e9",
        textAlign: "center",
        textTransform: "capitalize",
    };
    if (props.selected) {
        endNodeStyle.boxShadow = "0 0 6px #9E9E9E";
      }
  return (
    <div
    style={endNodeStyle}
    > <div>End</div>
    <TargetHandle />
  </div>
  )
}

export default EndNode