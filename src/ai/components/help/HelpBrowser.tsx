import React, { useEffect } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  AntDesignOutlined,
  ToolOutlined,
  RobotOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { helpContent } from "./data";
import PageNotFound from "../ui/general/PageNotFound";

type HelpBrowserProps = {};

const HelpBrowser: React.FC<HelpBrowserProps> = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPageId = params.get("currentPageId") || "playground-ai";
  const [selectedKey, setSelectedKey] = React.useState(currentPageId);

  useEffect(() => {
    setSelectedKey(currentPageId);
  }, [currentPageId]);

  const onClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
        onClick={onClick}
        style={{ width: 256 }}
        items={[
          {
            key: "playground-ai",
            icon: <AntDesignOutlined style={{ color: "#1890ff" }} />,
            label: "AI Playground",
          },
          {
            key: "roles",
            icon: <UserOutlined style={{ color: "#52c41a" }} />,
            label: "AI Roles",
          },
          {
            key: "tools",
            icon: <ToolOutlined style={{ color: "#722ed1" }} />,
            label: "AI Tools",
          },
          {
            key: "agents",
            icon: <RobotOutlined style={{ color: "#fa8c16" }} />,
            label: "AI Agents",
          },
          {
            key: "settings-ai",
            icon: <SettingOutlined style={{ color: "#f5222d" }} />,
            label: "Settings",
          },
          {
            key: "workflow-ai",
            icon: <PartitionOutlined style={{ color: "#13c2c2" }} />,
            label: "Workflow AI",
          },
        ]}
      />
      {helpContent[selectedKey] ? (
        <div style={{ padding: "0 24px", flex: 1, overflowY: "auto" }}>
          <h2>{helpContent[selectedKey].title}</h2>
          <ReactMarkdown>{helpContent[selectedKey].content}</ReactMarkdown>
        </div>
      ) : (
        <PageNotFound />
      )}
    </div>
  );
};

export default HelpBrowser;
