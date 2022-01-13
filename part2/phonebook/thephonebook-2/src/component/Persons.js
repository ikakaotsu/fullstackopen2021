import React, { useState } from "react";
import personsService from "../services/Persons";
import { Failed } from "./Message";

const Persons = ({ persons, setPersons }) => {
  const [errorMsg, setErrorMsg] = useState(null);

  const errorContent = (message) => {
    setErrorMsg(message);
    setTimeout(() => {
      setErrorMsg(null);
    }, 5000);
  };

  const onHandleClick = (name, id) => {
    const response = window.confirm(`Delete ${name}`);
    if (response) {
      personsService
        .erase(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((err) => {
          console.log(err);
          errorContent(
            `Information of ${name} has already been removed from server ${err}`
          );
        });
    }
  };
  return (
    <>
      <Failed msg={errorMsg} />
      <ul>
        {persons.map((el) => (
          <li key={el.id}>
            {el.name} {el.number}
            <button
              onClick={() => {
                onHandleClick(el.name, el.id);
              }}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
