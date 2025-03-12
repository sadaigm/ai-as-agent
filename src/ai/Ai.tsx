import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  AntDesignOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import AiRoutes from "./AiRoutes";
import { useInitData } from "./hooks/useInitData";
import useScreenSize from "./hooks/useScreenSize";
import { CSSProperties } from "styled-components";

const { Header, Sider, Content } = Layout;

export const themeColors = {
  backgroundColor: "#03579a",
  color: "#fff",
};

const Ai = () => {
  console.log(window.location.pathname);
  const { screenSize } = useScreenSize();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  console.log({ screenSize });
  const [contentStyle, setcontentStyle] = useState<CSSProperties>({
    minHeight: 280,
    height: "100%",
    background: colorBgContainer,
    borderRadius: borderRadiusLG,
  });
  const [collapsed, setCollapsed] = useState(
    screenSize === "mobile" || screenSize === "tablet"
  );

  useEffect(() => {
    setCollapsed(screenSize === "mobile" || screenSize === "tablet");
    if (screenSize === "mobile" || screenSize === "tablet") {
      setcontentStyle({
        minHeight: 280,
        height: "100%",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      });
    } else {
      setcontentStyle({
        minHeight: 280,
        height: "100%",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        margin: "24px 16px",
        padding: 24,
      });
    }
  }, [screenSize]);

  const [current, setCurrent] = useState(
    window.location.pathname.replace("/", "") || "playground-ai"
  );
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    window.location.assign("/" + e.key);
  };

  useInitData();

  const openHelpWindow = () => {
    const helpWindow = window.open(
      `/help?currentPageId=${current}`,
      "HelpWindow",
      "width=800,height=600"
    );
    if (helpWindow) {
      helpWindow.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.location.pathname === "/help") {
        event.preventDefault();
        return;
      }
      if (event.key === "F1") {
        event.preventDefault();
        openHelpWindow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [current]);

  return (
    <div>
      <Layout className="site-layout">
        {window.location.pathname !== "/help" && (
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div
              className="logo"
              style={{
                color: "white",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <a href="/">
                <img
                  height={"25px"}
                  width={"25px"}
                  src={window.location.origin + "/logo.png"}
                />
              </a>
            </div>
            <div
              style={{
                display: "flex",
                height: "Calc(100% - 75px)",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[current]}
                onClick={onClick}
                items={[
                  {
                    key: "playground-ai",
                    icon: <AntDesignOutlined />,
                    label: "AI Playground",
                  },
                  {
                    key: "roles",
                    icon: <UserOutlined />,
                    label: "Ai Roles",
                  },
                  {
                    key: "tools",
                    icon: <ToolOutlined />,
                    label: "Ai Tools",
                  },
                  {
                    key: "agents",
                    icon: <ThunderboltOutlined />,
                    label: "Ai Agents",
                  },
                ]}
              />
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[current]}
                onClick={onClick}
                items={[
                  {
                    key: "settings-ai",
                    icon: <SettingOutlined />,
                    label: "Settings",
                  },
                ]}
              />
            </div>
          </Sider>
        )}
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <span style={{ fontSize: "18px" }}>AI Agent</span>
            </div>
            {window.location.pathname !== "/help" && (
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                onClick={openHelpWindow} // Open HelpBrowser in a new window
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            )}
          </Header>
          <Content style={contentStyle}>
            <AiRoutes />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Ai;
