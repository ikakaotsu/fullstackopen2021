import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = (props) => {
  let array = Array.apply(null, new Array(6)).map(Number.prototype.valueOf, 0);
  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(array);
  const [winer, setWiner] = useState(0);

  const mostVoted = () => {
    const higher = vote.indexOf(Math.max(...vote));
    console.log("El mas Alto", higher);
    setWiner(higher);
  };

  const handleVote = () => {
    const copy = [...vote];
    copy[selected] += 1;
    setVote(copy);
    console.log(vote);
    mostVoted();
  };

  const randomNumber = () => {
    let max = props.anecdotes.length;
    let r_nro = Math.floor(Math.random() * max);
    setSelected(r_nro);
    // console.log(r_nro);
  };

  return (
    <div>
      <p>{props.anecdotes[selected]}</p>
      <button onClick={randomNumber}>next anecdote</button>
      <button onClick={handleVote}>Vote</button>
      <h2>Anecdote with most Votes</h2>
      <p>{props.anecdotes[winer]}</p>
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
