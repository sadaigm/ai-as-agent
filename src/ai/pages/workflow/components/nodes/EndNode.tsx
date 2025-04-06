import React from 'react'
import { Handle, Position } from 'reactflow';
import TargetHandle from '../handle/TargetHandle';

const EndNode = ({ data }: any) => {
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
        border: "1px solid #9E9E9E",
        borderRadius: "50%",
        background: "#e9e9e9",
        textAlign: "center",
        textTransform: "capitalize",
      }}
    > <div>End</div>
    <TargetHandle />
  </div>
  )
}

export default EndNode