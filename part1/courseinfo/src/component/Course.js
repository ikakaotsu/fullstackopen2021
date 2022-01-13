import React from "react";
import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const Course = ({ course }) => {
  const { name, parts } = course;
  return (
    <>
      <Header course={name} />
      {parts.map((part) => (
        <Content key={part.id} part={part} />
      ))}
      {/* <Content parts={parts} /> */}
      <Total parts={parts} />
    </>
  );
};

export default Course;
