import React from "react";
import JokeList from "./JokeList";

// function App() {
//   return (
//     <div className="App">
//       <JokeList />
//     </div>
//   );
// }



class App extends React.Component {
  constructor(){
    super()
  }

  render(){
    return (
          <div className="App">
            <JokeList />
          </div>
        )
  }
}
export default App;
