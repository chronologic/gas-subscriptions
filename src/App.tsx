import './App.css';

import * as React from 'react';
import { Eth } from 'web3x-es/eth';
import { WebsocketProvider } from 'web3x-es/providers';

import { GasStation } from './contracts/GasStation';
import logo from './logo.svg';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    

  }

  public deploy() {
    const provider = new WebsocketProvider('wss://mainnet.infura.io/ws');
    const eth = Eth.fromProvider(provider);
    const gasStation = new GasStation(eth);
    
    gasStation.deploy()
  }

  public renderContractButton() {
    if (!localStorage.getItem('gas-station-address')) {
      return (
        <button onClick={this.deploy} />
      )
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to LOL</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>

        {this.renderContractButton()}
      </div>
    );
  }
}

export default App;
