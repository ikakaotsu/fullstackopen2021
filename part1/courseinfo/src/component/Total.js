import React from "react";

const Total = (props) => {
  const total = props.parts.reduce((acumulator = 0, currentValue) => {
    return acumulator + currentValue.exercises;
  }, 0);

  // console.log(total);

  const suma = (props) => {
    let a = 0;
    props.parts.forEach((el) => {
      a += el.exercises;
    });
    return a;
  };

  return (
    <>
      <h3>Total of {suma(props)} exercises</h3>
      <h2>Total with reduce {total}</h2>
    </>
  );
};

export default Total;
