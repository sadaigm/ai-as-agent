import { Space } from "antd";
import React, { FC } from "react";
import { CheckCircleFilled, CloseCircleFilled, StopFilled, SyncOutlined } from "@ant-design/icons";

type StatusNodeProps = {
  name: string;
  status: string;
};

const StatusNode: FC<StatusNodeProps> = ({ name, status }) => {
  // Define a mapping for status to style and icon
  const statusStyles: Record<string, { color: string; icon: React.ReactNode }> = {
    "Completed": { color: "#009688", icon: <CheckCircleFilled /> },
    "Not Started": { color: "#03a9f4", icon: <CheckCircleFilled /> },
    "Running": { color: "#3f51b5", icon: <SyncOutlined spin /> },
    "Failed": { color: "#f44336", icon: <CloseCircleFilled /> },
    "Cancelled": { color: "#ff5722", icon: <StopFilled /> },
  };

  const { color, icon } = statusStyles[status] || { color: "#000000", icon: null };

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Space>
        <div style={{ fontWeight: "bold" }}>{name}</div>
        {icon && (
          <div>
            {React.cloneElement(icon as React.ReactElement, { style: { color, marginRight: "5px" } })}
            <span style={{ color, marginRight: "5px" }}>{status}</span>
          </div>
        )}
      </Space>
    </div>
  );
};

export default StatusNode;
