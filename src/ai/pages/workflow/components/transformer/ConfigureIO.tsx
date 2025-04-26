import React, { FC } from 'react'


type ConfigureIOProps = {
    nodeType: string;
    nodeId: string;
    nodeData: any;
}

const ConfigureIO: FC<ConfigureIOProps> = ({ nodeType, nodeId, nodeData}) => {

    console.log({nodeData, nodeId, nodeType})

  return (
    <div></div>
  )
}

export default ConfigureIO