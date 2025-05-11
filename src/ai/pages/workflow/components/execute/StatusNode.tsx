import { Space } from "antd";
import React, { FC } from "react";
import { CheckCircleFilled } from "@ant-design/icons";

type StatusNodeProps = {
  name: string;
  status: string;
};

const StatusNode: FC<StatusNodeProps> = ({ name, status }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Space>
        <div style={{ fontWeight: "bold" }}>{name}</div>
        {status === "Completed" && (
          <div>
            <CheckCircleFilled
              style={{ color: "#009688", marginRight: "5px" }}
            />

            <span style={{ color: "#009688", marginRight: "5px" }} >{status}</span>
          </div>
        )}
        {status === "Not Started" && (
          <div>
            <CheckCircleFilled
              style={{ color: "#03a9f4", marginRight: "5px" }}
            />

            <span  style={{ color: "#03a9f4", marginRight: "5px" }}>{status}</span>
          </div>
        )}
        {status === "Running" && (
          <div>
            <CheckCircleFilled
              style={{ color: "#ffc107", marginRight: "5px" }}
            />

            <span style={{ color: "#ffc107", marginRight: "5px" }}>{status}</span>
          </div>
        )}

        {status === "Failed" && (
          <div>
            <CheckCircleFilled
              style={{ color: "#ff5722", marginRight: "5px" }}
            />

            <span style={{ color: "#ff5722", marginRight: "5px" }}>{status}</span>
          </div>
        )}
      </Space>
    </div>
  );
};

export default StatusNode;
