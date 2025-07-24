import { Button, ButtonProps } from "antd";
import React, { FC } from "react";

const MicrophoneIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

const RecordButton: FC<ButtonProps> = (props) => {
  return (
    <Button {...props} type="primary" icon={<MicrophoneIcon />}>
      Start Recording
    </Button>
  );
};

export default RecordButton;
