import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Statistic = ({ text, value }) => {
  return (
    <>
      <tbody>
        <tr>
          <td>
            {text}: {value}
          </td>
        </tr>
      </tbody>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let average = (good - bad) / all;
  let positive = (good / all) * 100;

  if ((good || neutral || bad) !== 0) {
    return (
      <>
        <h1>Statistics</h1>
        <table>
          <Statistic text="good" value={good} />
          <Statistic text="neutral" value={neutral} />
          <Statistic text="bad" value={bad} />
          <Statistic text="all" value={all} />
          <Statistic text="average" value={average} />
          <Statistic text="positive" value={positive} />
        </table>
      </>
    );
  }
  return (
    <>
      <h1>Statistics</h1>
      <strong>Caracolas!, la concha del mar. No hay Datos</strong>
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const good_f = () => setGood(good + 1);

  const neutral_f = () => setNeutral(neutral + 1);

  const bad_f = () => setBad(bad + 1);

  return (
    <>
      <h1> give feedBack</h1>
      <button onClick={good_f}>good</button>
      <button onClick={neutral_f}>neutral</button>
      <button onClick={bad_f}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
