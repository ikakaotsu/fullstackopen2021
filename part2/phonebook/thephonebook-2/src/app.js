import React, { useEffect, useState } from "react";
import Filter from "./component/Filter";
import PersonForm from "./component/PersonForm";
import Persons from "./component/Persons";
import personsService from "./services/Persons";
import { Successful } from "./component/Message";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filterPerson, setFilterPerson] = useState(persons);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    personsService.getAll().then((all) => {
      setPersons(all);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (!persons.map((el) => el.name).includes(newName)) {
      personsService
        .create(newPerson)
        .then((newperson) => setPersons(persons.concat(newperson)));
      successContent(`Added ${newPerson.name}`);
    } else {
      const find = persons.find((person) => person.name === newName);
      find.number = newNumber;
      const replace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (replace) {
        personsService.update(find.id, find).then((response) => {
          setPersons(
            persons.map((person) => {
              return person.id === response.id ? response : person;
            })
          );
          successContent(`Update ${find.name}`);
        });
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    if (value) {
      setFilterPerson(
        persons.filter(
          (el) => el.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        )
      );
    }
  };

  const successContent = (message) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <Successful msg={successMsg} />
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={filter.length <= 1 ? persons : filterPerson}
        setPersons={filter.length <= 1 ? setPersons : setFilterPerson}
      />
    </div>
  );
};

export default App;
