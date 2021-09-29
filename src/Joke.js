import React from "react";
import "./Joke.css";

class Joke extends React.Component{
  constructor(props){
    super(props)
    this.upVote=this.upVote.bind(this)
    this.downVote=this.downVote.bind(this)
  }
  upVote=()=>{
    this.props.vote(this.props.id, + 1)

  }
  downVote=()=>{
    this.props.vote(this.props.id, - 1)

  }
  toggle=(id)=>{
    this.props.toggleLock(id)
  }


  render(){
    
    return( 
      <div className="Joke">
        {this.props.locked ? <i onClick={()=>this.toggle(this.props.id)}className="fas fa-lock Joke-lock"></i>:<i onClick={()=>this.toggle(this.props.id)}className="fas fa-lock-open Joke-lock"></i>}
        <div className="Joke-votearea">
          <button onClick={this.upVote.bind(this)}>
            <i className="fas fa-thumbs-up" />
          </button>

          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down" />
          </button>

          {this.props.votes}
        </div>

        <div className="Joke-text">{this.props.text} </div>
      </div>
      )
  }
}
export default Joke;
