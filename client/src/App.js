import React from 'react';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <form>
          <label>
            Name: &emsp;
            <input type="text" name="Player Name" />
          </label> &emsp;
          <input type="submit" value="Submit" onSubmit/>
        </form>        
      </header>
    </div>
  );
}

export default App;
