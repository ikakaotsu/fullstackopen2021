import React from "react";

const ShowCountry = ({ country, weather = { status: false } }) => {
  return (
    <>
      <h3>{country.data[0].name}</h3>
      <span>Capital: {country.data[0].capital}</span>
      <ul>
        {country.data[0].languages.map((lan, index) => (
          <li key={index}>{lan.name}</li>
        ))}
      </ul>
      <div>
        <img
          style={{ height: "80px", width: "100px" }}
          alt="flag"
          src={country.data[0].flag}
        />
      </div>
      {weather.status ? (
        <div>
          <h3>Weather in {country.data[0].name}</h3>
          <p>
            <strong>temperature:</strong> {weather.temperature} celsius
          </p>
          <img src={weather.icon} alt="icon" />
          <p>
            <strong>wind:</strong> {weather.windSpeed} kph direction{" "}
            {weather.windDirection}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default ShowCountry;
