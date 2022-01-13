import React from "react";

const Persons = ({ persons }) => {
  return (
    <>
      <ul>
        {persons.map((el) => (
          <li key={el.name}>
            {el.name} {el.number}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
