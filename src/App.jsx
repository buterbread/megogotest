import React from 'react';
import './App.css';

import PlayerBox from './containers/PlayerBox';
import ChartBox from './containers/ChartBox';

function App() {
  return (
    <div className="App">
      <header className="header">Hello there.</header>
      <div className="body">
        <div className="videoPageContent">
          <PlayerBox uri="https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd" />
          <ChartBox />
        </div>
      </div>
    </div>
  );
}

export default App;
