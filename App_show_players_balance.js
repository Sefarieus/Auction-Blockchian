import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  constructor(props) {
	  super(props);
    this.state = { 
      manager: "NOT SET",
      players: [],
      balance: '' 
    };
  }

  // will be executed after page gets loaded
  async componentDidMount() {
    // solidity calls are async call, add await in front of call to make sync.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    // update this.state.manager so render() will be executed
	  this.setState({manager: manager, players: players, balance: balance});
  }

  // will be called when any variable in this.state get changed
  render() {
	  // you can see this line in the browser console
	  console.log("manager is " + this.state.manager);

    return (
      <div>
      <div className="App">
	      <h1>Lottery Contract</h1>
      </div>
      <div align="left">
	      <p>
          This contract is managed by {this.state.manager} <br/>
          <ul>
            {this.state.players.map((value, index) => {
              return <li key={index}>player: {value}</li>
            })}
          </ul>
          Total current pool is {this.state.balance}.
        </p>
      </div>
      </div>
    );
  }
}

export default App;
