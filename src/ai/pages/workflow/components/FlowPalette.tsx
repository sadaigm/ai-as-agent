import React, { useCallback } from "react";
import { useAgents } from "../../../hooks/useAgents";
import { Card, Divider, List, Typography } from "antd";
import { useTools } from "../../../hooks/useTools";

const BasicNodes = ["startNode", "endNode"]; // Basic nodes that are not draggable

const FlowPalette = () => {
  const { agents } = useAgents(); // Fetch AI agents
  const { tools } = useTools(); // Fetch tools

  const nodeCallBack = useCallback((node: string) => {
    console.log("Node callback", node);
    // Handle node-specific logic here
  }, []);
  // Handle drag start for nodes
  const onDragStart = (event: React.DragEvent, nodeType: string, node: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType, node: node, callback: nodeCallBack, })
    );
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div style={{ width: "20%", padding: "1rem", background: "#f0f2f5", overflowY: "auto" }}>
      <Card title="Basic Nodes" style={{ marginBottom: "1rem" }}>
        <List
          dataSource={BasicNodes}
          renderItem={(node) => (
            <List.Item
              draggable
              onDragStart={(event) => onDragStart(event, node, { name: node })}
            >
              <Typography.Text
                style={{
                  textTransform: "capitalize",
                }}
              >
                {node}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
      <Divider />

      <Card title="AI Agents" style={{ marginBottom: "1rem" }}>
        <List
          dataSource={agents}
          renderItem={(agent) => (
            <List.Item
              draggable
              onDragStart={(event) => onDragStart(event, "agentNode", agent)}
            >
              <Typography.Text
                style={{
                  textTransform: "capitalize",
                }}
              >
                {agent.name}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
      <Card title="Tools">
        <List
          dataSource={tools}
          renderItem={(tool) => (
            <List.Item
              draggable
              onDragStart={(event) => onDragStart(event, "toolNode", tool)}
            >
              <Typography.Text
                style={{
                  textTransform: "capitalize",
                }}
              >
                {tool.function.name}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default FlowPalette;
