import { Button, ButtonProps } from "antd";
import React, { FC } from "react";

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const StopButton: FC<ButtonProps> = (props) => {
  return (
    <div className="speaking-overlay">
      <div className="speaking-message">
        <img
          height={150}
          width={150}
          src="/hearing.gif"
          alt="Speaking animation"
          className="speaking-gif"
        />
        Listening...
        <br />
        <br />
        <Button {...props} type="default" danger icon={<StopIcon />}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export default StopButton;
