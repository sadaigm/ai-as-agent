import { ButtonProps, Button } from 'antd';
import React, { FC } from 'react'

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ClearButton: FC<ButtonProps> = (props) => {
  return (
    <Button {...props} type="default" danger icon={<ClearIcon />}>
      Clear
    </Button>
  );
}

export default ClearButton