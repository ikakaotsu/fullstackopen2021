import React, { useState } from "react";
import ShowCountry from "./ShowCountry";

const ListCountries = ({ country }) => {
  const [btnClicked, setBtnClicked] = useState(false);
  const [showcountry, setShowCountry] = useState({
    data: null,
    found: false,
    message: "No country found",
  });
  const handleBtnClicked = (el) => {
    setBtnClicked(true);
    setShowCountry({
      data: [el],
      found: true,
      message: null,
    });
  };

  if (country.data) {
    return (
      <ul>
        {country.data.map((el, index) => (
          <li key={index}>
            {el.name}
            <button onClick={() => handleBtnClicked(el)}>Ver</button>
          </li>
        ))}
        {btnClicked ? <ShowCountry country={showcountry} /> : null}
      </ul>
    );
  } else {
    return (
      <>
        <ul>
          <li>{country.message}</li>
        </ul>
      </>
    );
  }
};

export default ListCountries;
