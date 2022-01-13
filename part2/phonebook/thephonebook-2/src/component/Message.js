import React from "react";

export const Successful = ({ msg }) => {
  const messageStyle = {
    color: "green",
    border: "solid green",
    fontStyle: "italic",
    fontSize: 20,
    margin: 12,
    padding: 10,
    background: "#d0f0c0",
  };
  if (msg === null) {
    return null;
  }
  return (
    <div style={messageStyle}>
      <em>{msg}</em>
      <br />
    </div>
  );
};

export const Failed = ({ msg }) => {
  const messageStyle = {
    color: "red",
    border: "solid red",
    fontStyle: "italic",
    fontSize: 20,
    margin: 12,
    padding: 10,
    background: "#FA5858",
  };
  if (msg === null) {
    return null;
  }
  return (
    <div style={messageStyle}>
      <em>{msg}</em>
    </div>
  );
};
