import React from "react";
import Part from "./Part";

const Content = ({ part }) => {
  // const { id, name, exercises } = part;
  return (
    <>
      {/* <Part key={id} name={name} exercise={exercises} /> */}
      <Part key={part.id} {...part} />
    </>
  );
};

export default Content;
