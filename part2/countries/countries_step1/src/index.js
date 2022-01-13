import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ListCountries from "./components/ListCountries";
import ShowCountry from "./components/ShowCountry";
import "./index.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [showcountry, setShowCountry] = useState({
    data: null,
    found: false,
    message: "No country found",
  });
  const [weatherData, setWeatherData] = useState({});

  const apikey = "11d36ff9fee640551a298410f8708181";
  const baseUrl = `http://api.weatherstack.com/current?access_key=${apikey}&query=${country}`;

  useEffect(() => {
    const getWeather = async () => {
      try {
        const res = await axios.get(baseUrl);
        console.log(res);
        setWeatherData({
          temperature: res.data.current.temperature,
          icon: res.data.current.weather_icons[0],
          windSpeed: res.data.current.wind_speed,
          windDirection: res.data.current.wind_dir,
          status: true,
        });
      } catch (err) {
        console.log(err);
        setWeatherData({ status: false });
      }
    };
    getWeather();
  }, [baseUrl]);

  useEffect(() => {
    let url = `https://restcountries.eu/rest/v2/all`;
    axios.get(url).then((res) => {
      console.log("Res data es:", res.data);
      setCountries(res.data);
    });
  }, []);

  const onHandleCountrieChange = (event) => {
    setCountry(event.target.value);
    let filterCountries;
    if (event.target.value === "") {
      filterCountries = [];
    } else {
      filterCountries = countries.filter((c) =>
        c.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      console.log("Filtrado por Nom", filterCountries);
    }
    if (filterCountries.length === 0 && event.target.value === "") {
      setShowCountry({
        data: null,
        found: false,
        message: "No country Found",
      });
    } else if (filterCountries.length === 1) {
      setShowCountry({
        data: filterCountries,
        found: true,
        message: null,
      });
    } else if (filterCountries.length <= 10) {
      setShowCountry({
        data: filterCountries.filter((c) => c.name),
        found: false,
        message: null,
      });
    } else if (filterCountries.length > 10) {
      setShowCountry({
        data: null,
        found: false,
        message: "Too many countries matched to show",
      });
    }
  };

  return (
    <>
      <h1>Countries</h1>
      find countries <input value={country} onChange={onHandleCountrieChange} />
      {showcountry.found ? (
        <ShowCountry country={showcountry} weather={weatherData} />
      ) : (
        <ListCountries country={showcountry} />
      )}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
