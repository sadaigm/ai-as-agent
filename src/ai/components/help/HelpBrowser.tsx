import React, { useEffect } from "react";
import { Menu } from "antd";
import { MenuProps } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  AntDesignOutlined,
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
            icon: <AntDesignOutlined />,
            label: "AI Playground",
          },
          {
            key: "roles",
            icon: <UserOutlined />,
            label: "AI Roles",
          },
          {
            key: "tools",
            icon: <SettingOutlined />,
            label: "AI Tools",
          },
          {
            key: "agents",
            icon: <ThunderboltOutlined />,
            label: "AI Agents",
          },
          {
            key: "settings-ai",
            icon: <SettingOutlined />,
            label: "Settings",
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
