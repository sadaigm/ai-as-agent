import { Button, Card, Space } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React from "react";

export const PreBlock = ({
  node,
  inline,
  className,
  language,
  as,
  href,
  ...otherProps
}: any) => {
  console.log("PreBlock", {
    node,
    inline,
    className,
    language,
    as,
    href,
    otherProps,
  });
  return (
    <div>
      <pre>{otherProps.children}</pre>
    </div>
  );
};

const CodeBlock = ({
  node,
  inline,
  className,
  language,
  as,
  href,
  ...otherProps
}: any) => {
  const match = /language-(\w+)/.exec(className || "");
  console.log("CodeBlock", {
    node,
    inline,
    className,
    language,
    as,
    href,
    otherProps,
  });
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 20000);
    }
  }, [copied]);

  return (
    <div>
      {match ? (
        <Card
          className="agent__codeblock contain-inline-size rounded-md border-[0.5px] border-token-border-medium relative bg-token-sidebar-surface-primary dark:bg-gray-950"
          title={match ? match[1] : "Code"}
          bordered={false}
          style={{ flex: 1, backgroundColor: "#cad4d854" }}
          extra={
            <Space>
              <span>{copied ? "copied" : ""}</span>
              <Button
                className={copied ? "copied" : ""}
                shape="circle"
                icon={<CopyOutlined />}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(otherProps.children);
                    console.log("copied to clipboard");
                    setCopied(true);
                  } catch (err) {
                    console.error("Failed to copy: ", err);
                  }
                }}
              />
            </Space>
          }
        >
          <code>{otherProps.children}</code>
        </Card>
      ) : (
        <div className="agent__codeblock-nolang contain-inline-size rounded-md border-[0.5px] border-token-border-medium relative bg-token-sidebar-surface-primary dark:bg-gray-950">
          <code>{otherProps.children}</code>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
