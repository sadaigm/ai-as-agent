import React from 'react'
import { Handle, Position } from 'reactflow'

const SourceHandle = () => {
  return (
    <Handle
    style={{
        background: "#FF9800",
        borderRadius: "50%",
        width: "10px",
        height: "10px",
      }}
    type="source" position={Position.Bottom} isConnectable={true} />
  )
}

export default SourceHandle