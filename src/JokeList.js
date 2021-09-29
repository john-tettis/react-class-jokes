import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import loading from './Loading.png'
import "./JokeList.css";

// function JokeList({ numJokesToGet = 10 }) {
//   const [jokes, setJokes] = useState([]);

//   /* get jokes if there are no jokes */

//   useEffect(function() {
//     async function getJokes() {
//       let j = [...jokes];
//       let seenJokes = new Set();
//       try {
//         while (j.length < numJokesToGet) {
//           let res = await axios.get("https://icanhazdadjoke.com", {
//             headers: { Accept: "application/json" }
//           });
//           let { status, ...jokeObj } = res.data;
  
//           if (!seenJokes.has(jokeObj.id)) {
//             seenJokes.add(jokeObj.id);
//             j.push({ ...jokeObj, votes: 0 });
//           } else {
//             console.error("duplicate found!");
//           }
//         }
//         setJokes(j);
//       } catch (e) {
//         console.log(e);
//       }
//     }

//     if (jokes.length === 0) getJokes();
//   }, [jokes, numJokesToGet]);

//   /* empty joke list and then call getJokes */

//   function generateNewJokes() {
//     setJokes([]);
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   function vote(id, delta) {
//     setJokes(allJokes =>
//       allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
//     );
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   if (jokes.length) {
//     let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  
//     return (
//       <div className="JokeList">
//         <button className="JokeList-getmore" onClick={generateNewJokes}>
//           Get New Jokes
//         </button>
  
//         {sortedJokes.map(j => (
//           <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
//         ))}
//       </div>
//     );
//   }

//   return null;

// }


class JokeList extends React.Component {
  constructor(props) {
    super(props)
    this.numJokesToGet = this.props.numJokesToGet;
    this.getJokes = this.getJokes.bind(this);
    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.resetVotes = this.resetVotes.bind(this)
    this.toggleLock=this.toggleLock.bind(this)
    this.state={
      jokes:[]
    }
  }
  getJokes= async ()=>{
    let j = [...this.state.jokes];
    let numJokesToGet = this.numJokesToGet
    let seenJokes = new Set();
    let local = window.localStorage
    let localJokes = JSON.parse(local.getItem('jokes'))
    console.log(localJokes)
    // if(localJokes && localJokes.length===numJokesToGet){
    // //   this.setState({jokes:localJokes})
    // // }
    // else{
      try {
        while (j.length < numJokesToGet) {
          console.log('axios')
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data;
  
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0, locked:false });
          } else {
            console.error("duplicate found!");
          }
        }
        this.setState({jokes:j});
      } catch (e) {
        console.log(e);
      }
    //}
  }
  generateNewJokes=()=>{
    let remainingJokes=this.state.jokes.filter(j=>j.locked)
    this.setState({jokes:remainingJokes})
    window.localStorage.setItem('jokes', JSON.stringify([]))
    // this.getJokes();
  }

  vote=(id, delta)=>{
    let updated= this.state.jokes.map(j=> j.id ===id ? {...j, votes:j.votes+delta}: j)
    this.setState({jokes:updated})
  }
  resetVotes=()=>{
    let updated= this.state.jokes.map(j=>({...j, votes:0}))
    this.setState({jokes:updated})
  }
  toggleLock=(id)=>{
    console.log(id)
    let updated= this.state.jokes.map(j=> j.id ===id ? {...j, locked:!j.locked}: j)
    this.setState({jokes:updated})

  }

  componentDidMount(){
      let jokes= JSON.parse(window.localStorage.getItem('jokes'))
      if(jokes && jokes.length === this.numJokesToGet){
        this.setState({jokes})
      }
      else{
        this.getJokes();
      }
  }
  componentDidUpdate(){
    if(this.state.jokes.filter(j=>!j.locked).length===0){
      this.getJokes();

    }
    window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
  }

  render(){
    let jokes = this.state.jokes

    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          <button className='JokeList-reset-votes' onClick={this.resetVotes}>Reset votes</button>
    
          {sortedJokes.map(j => (
            <Joke 
            locked = {j.locked}
            toggleLock = {this.toggleLock}
            text={j.joke} 
            key={j.id} id={j.id} 
            votes={j.votes} 
            vote={this.vote} />
          ))}
        </div>
      );
    }
  
    return <div className="loader">Loading...</div>;
  }
}

JokeList.defaultProps ={
  numJokesToGet:10
}

export default JokeList;
