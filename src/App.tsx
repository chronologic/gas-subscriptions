import "./App.css";

import * as React from "react";
import logo from "./logo.svg";
import { ethers } from "ethers";
import * as GasStation from "./contracts/GasStation.json";
import * as Counter from "./contracts/Counter.json";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

interface State {
  gasStation: string;
  counter: string;
  counterCurrentValue: number;
  owner: string;
  plan: number[];
  signedMessage: string;
}

class App extends React.Component<any, State> {
  gasStationAddress = "gas-station-address";
  counterContract = "counter-address";

  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;

  constructor(props: any) {
    super(props);

    this.state = {
      gasStation: localStorage.getItem(this.gasStationAddress),
      counter: localStorage.getItem(this.counterContract),
      plan: [0, 0]
    } as State;
  }

  public async componentWillMount() {
    if (window && window.ethereum && window.ethereum.enable) {
      window.ethereum.enable();
    }

    this.provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    );
    this.signer = this.provider.getSigner();

    await this.updatePlan();
    await this.updateCounter();
  }

  public contractFactory(contract: any) {
    return ethers.ContractFactory.fromSolidity(contract, this.signer);
  }

  public get gasStation() {
    return this.contractFactory(GasStation).attach(this.state.gasStation);
  }

  public get counter() {
    return this.contractFactory(Counter).attach(this.state.counter);
  }

  public async deployGasStation() {
    const deployer = await this.signer.getAddress();
    const contract = await this.contractFactory(GasStation).deploy(deployer);

    await contract.deployed();

    localStorage.setItem(this.gasStationAddress, contract.address);
    this.setState({ gasStation: contract.address, owner: deployer });
  }

  public async deployCounter() {
    const contract = await this.contractFactory(Counter).deploy();

    await contract.deployed();

    localStorage.setItem(this.counterContract, contract.address);
    this.setState({ counter: contract.address });
  }

  public async updatePlan() {
    setInterval(async () => {
      if (!this.state.gasStation) return;

      const signer = await this.signer.getAddress();
      const plan = await this.gasStation.plan(signer);

      const parsed = [
        ethers.utils.bigNumberify(plan[0]._hex).toNumber(),
        ethers.utils.bigNumberify(plan[1]._hex).toNumber()
      ];

      this.setState({ plan: parsed });
    }, 2000);
  }

  public async updateCounter() {
    setInterval(async () => {
      if (!this.state.counter) return;

      const counter = await this.counter.getCounter();

      this.setState({
        counterCurrentValue: ethers.utils.bigNumberify(counter._hex).toNumber()
      });
    }, 2000);
  }

  public async subscribe() {
    const signer = await this.signer.getAddress();
    const tx = await this.gasStation.subscribeETH(signer, 0, {
      value: 20000
    });
    const receipt = await tx.wait();
  }

  public async sign() {
    const signer = await this.signer.getAddress();
    let nonce = await this.gasStation.nonce(signer);
    nonce = ethers.utils.bigNumberify(nonce._hex).toNumber();

    const types = [
      "address",
      "address",
      "address",
      "uint256",
      "bytes",
      "uint256"
    ];

    const message = [
      this.state.gasStation, //proxy
      signer, //signer
      this.state.counter, //destination
      0, //value
      "0xd09de08a", //increment calldata
      nonce
    ];

    const hash = ethers.utils.solidityKeccak256(types, message);
    const signedMessage = await this.signer.signMessage(hash);

    this.setState({ signedMessage });
  }

  public async relay() {
    const signer = await this.signer.getAddress();

    debugger;
    const relay = await this.gasStation.relay(
      this.state.signedMessage,
      signer,
      this.state.counter,
      0,
      "0xd09de08a"
    );

    const receipt = await relay.wait();
    debugger;
  }

  public renderGasStation() {
    if (!this.state.gasStation) {
      return (
        <div>
          <button onClick={this.deployGasStation.bind(this)}>
            Deploy GasStation
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div> Using GasStation {this.state.gasStation} </div>
          <div> Owner {this.state.owner} </div>
        </div>
      );
    }
  }

  public renderCounter() {
    if (!this.state.counter) {
      return (
        <div>
          <button onClick={this.deployCounter.bind(this)}>
            Deploy Counter
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div> Using Counter {this.state.counter} </div>
        </div>
      );
    }
  }

  public renderSubscribe() {
    if (!this.state.gasStation) {
      return <div>Deploy before subscribing</div>;
    } else {
      return (
        <button onClick={this.subscribe.bind(this)}>Subscribe to plan</button>
      );
    }
  }

  public renderCounterSign() {
    if (!this.state.counter) {
      return <div>Deploy before using</div>;
    } else {
      return (
        <div>
          <div> Counter current value: {this.state.counterCurrentValue} </div>
          <br />
          <button onClick={this.sign.bind(this)}>Increment</button>
          <div>Signed message: {this.state.signedMessage}</div>
          <br />
          <button onClick={this.relay.bind(this)}>Relay</button>
        </div>
      );
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to GasStation subscription service
          </h1>
        </header>
        <p className="App-intro">YAY!</p>

        {this.renderGasStation()}
        {this.renderCounter()}
        <hr />
        {this.renderCounterSign()}
        <hr />
        <div>My current plan:</div>
        <div> Remaining gas: {this.state.plan[0]} </div>
        <div>
          {" "}
          Valid util gas: {new Date(
            this.state.plan[1] * 1000
          ).toISOString()}{" "}
        </div>
        {this.renderSubscribe()}
      </div>
    );
  }
}

export default App;
