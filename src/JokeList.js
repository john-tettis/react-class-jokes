import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

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
    try {
      while (j.length < numJokesToGet) {
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
