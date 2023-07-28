import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  constructor(props) {
	  super(props);
    this.state = { 
      manager: "NOT SET" 
    };
  }

  // will be executed after page gets loaded
  async componentDidMount() {
    // solidity calls are async call, add await in front of call to make sync.
    const manager = await lottery.methods.manager().call();

    // update this.state.manager so render() will be executed
	  this.setState({manager: manager});
  }

  // will be called when any variable in this.state get changed
  render() {
	  // you can see this line in the browser console
	  console.log("manager is " + this.state.manager);

    return (
      <div className="App">
	      <h1>Lottery Contract</h1>
	      <p>This contract is managed by {this.state.manager}</p>
      </div>
    );
  }
}

export default App;
