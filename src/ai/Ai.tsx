import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SettingOutlined,
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
    window.location.pathname.replace("/", "") || "agents"
  );
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    window.location.assign("/" + e.key);
  };

  useInitData();
  return (
    <div>
      <Layout className="site-layout">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {/* <Link to="/"> */}
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
          {/* </Link> */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[current]}
            onClick={onClick}
            items={[
              {
                key: "playground-ai",
                icon: <UserOutlined />,
                label: "AI Playground",
              },
              {
                key: "roles",
                icon: <UserOutlined />,
                label: "Ai Roles",
              },
              {
                key: "tools",
                icon: <SettingOutlined />,
                label: "Ai Tools",
              },
              {
                key: "agents",
                icon: <ThunderboltOutlined />,
                label: "Ai Agents",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
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
