import React from 'react'
import { Handle, Position } from 'reactflow'

const TargetHandle = () => {
  return (
    <Handle
    style={{
        background: "#1890ff",
        borderRadius: "50%",
        width: "10px",
        height: "10px",
      }}
    type="target" position={Position.Top} isConnectable={true} />
  )
}

export default TargetHandle