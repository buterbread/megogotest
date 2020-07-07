import React from 'react';
import './App.css';

import PlayerBox from './components/PlayerBox';
import ChartBox from './components/ChartBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">Hello there.</header>
      <PlayerBox
        uri="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
        callback={() => {
          console.log('CALLBACK');
        }}
      />
      <ChartBox />
    </div>
  );
}

export default App;
