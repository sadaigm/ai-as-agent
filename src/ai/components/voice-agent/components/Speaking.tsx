import React from "react";
import "./Speaking.css"; // Import CSS for styling

const Speaking = () => {
  return (
    <div className="speaking-overlay">
      <img
        height={150}
        width={150}
        src="/speaking.gif"
        alt="Speaking animation"
        className="speaking-gif"
      />
      <div className="speaking-message">Speaking...</div>
    </div>
  );
};

export default Speaking;
