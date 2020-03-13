import React, {Component} from 'react';
import Application from './Application/Application.js';
import './App.css';

export default class App extends Component {
 
  constructor (props){
    super(props);
    
    this.state = {};

  } 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Application/>
        </header>
      </div>
    );
  }



}
