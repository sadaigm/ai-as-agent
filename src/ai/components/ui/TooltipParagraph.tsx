import React, { useState } from "react";
import Paragraph, { ParagraphProps } from "antd/es/typography/Paragraph";
import { Tooltip } from "antd";

const TooltipParagraph: React.FC<ParagraphProps> = ({
  children,
  ellipsis,
  ...props
}) => {
  const [truncated, setTruncated] = useState(false);

  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  return (
    <Tooltip title={truncated ? children : undefined}>
        {children}
      <Paragraph ellipsis={{
          rows,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
      
        // {...props}
        // ellipsis={{ ...ellipsis, onEllipsis: setTruncated }}
      >
        {/* NOTE: Fragment is necessary to avoid showing the title */}
        <>{children}</>
      </Paragraph>
    </Tooltip>
  );
};

export default TooltipParagraph;
