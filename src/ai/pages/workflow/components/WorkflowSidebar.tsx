import { Tabs } from 'antd'
import React from 'react'
import FlowPalette from './FlowPalette'
import FlowConfigs from './FlowConfigs'

const WorkflowSidebar = () => {
  return (
    <Tabs tabPosition='left' defaultActiveKey="1" items={[
      {
        label: `Flow Elements`,
        key: '1',
        children: (
            <FlowPalette />
        ),
      },
      {
        label: `Flow Configs`,
        key: '2',
        children: (
          <div>
            <FlowConfigs />
          </div>
        ),
      },
    ]} />
  )
}

export default WorkflowSidebar