import logo from "./logo.svg";
import "./App.css";
import RadioPlayer from "./components/Radio";

function App() {
  return (
    <div className="App">
      <RadioPlayer url={'http://media-ice.musicradio.com/ClassicFMMP3'} />{" "}
    </div> 
  );
}

export default App;
