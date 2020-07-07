import React, { PureComponent } from 'react';
import './App.css';

import PlayerBox from './containers/PlayerBox';
import ChartBox from './containers/ChartBox';

const DEFAULT_STREAM_URL = "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      playerUrl: DEFAULT_STREAM_URL
    }
  }

  handlePlayerUrlChange = (e) => {
    const { value } = e.target;

    this.setState({ playerUrl: value });
  }

  render() {
    const { playerUrl } = this.state;

    return (
      <div className="App">
        <header className="header">
          Hello there.
          <br />
          <input type="text" value={playerUrl} onChange={this.handlePlayerUrlChange} />
        </header>
        <div className="body">
          <div className="videoPageContent">
            <PlayerBox url={playerUrl} />
            <ChartBox />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
