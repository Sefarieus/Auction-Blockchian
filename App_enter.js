import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {
  state = { 
    manager: "NOT SET",
    players: [],
    balance: '',
    value: '',
    defaultAccount: '',
    status: 'Inited' 
  };
  
  constructor(props) {
    super(props);

    // function(account) {...}.bind(this)
    window.ethereum.on('accountsChanged', (account) => {
      console.log("MetaMask account just changed to " + account);
      this.setState({defaultAccount: account});
    });

  };

  async reload() {
    const accounts = await window.ethereum.enable();

    // solidity calls are async call, add await in front of call to make sync.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    // const balance = await lottery.methods.getBalance().call();

    // set all the data into this.state, render() will be executed after the update
    this.setState({manager: manager, 
                  players: players, 
                  balance: balance,
                  value: '',
                  defaultAccount: accounts[0]
                });
  }

  // will be executed after page gets loaded
  async componentDidMount() {

    this.reload();

    /*
    // to get the current account
    const accounts = await window.ethereum.enable();

    // solidity calls are async call, add await in front of call to make sync.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    // const balance = await lottery.methods.getBalance().call();

    // set all the data into this.state, render() will be executed after the update
    this.setState({manager: manager, 
                  players: players, 
                  balance: balance,
                  value: '',
                  defaultAccount: accounts[0]
                });
                */
  }

  onSubmit = async event => {
    event.preventDefault();
	  console.log("amount entered is " + this.state.value);

    const accounts = await web3.eth.getAccounts();
    console.log("total account number is " + accounts.length);
    
    this.setState({status: "Updating..."});
    await lottery.methods.enter().send({
      from: accounts[0], // should we try this.state.defaultAccount?
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    console.log("completed ");

    this.reload();

    // if we display this status value, then the page will be refreshed
    this.setState({status: "Done"});

  };

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
          The contract manager is {this.state.manager} <br/>
          <ul>
            {this.state.players.map((value, index) => {
              return <li key={index}>player: {value}</li>
            })}
          </ul>
          Total current pool is {web3.utils.fromWei(this.state.balance, 'ether')} ether.
        </p>
      </div>

      <form onSubmit={this.onSubmit}>
        {/* <h4>Enter to win</h4> */}
        <div>
          <label>Amount of ether to enter</label>
          <input value={this.state.value} onChange={event => this.setState({value: event.target.value})} />
        </div>
        <input type="submit" value="Enter to Win" />
      </form>
      
      <hr/>

      <div>
        <p>Current user is {this.state.defaultAccount}</p>
      </div>
      <div>
        <p>Status: {this.state.status}</p>
      </div>

      </div>
    );
  }
}

export default App;
