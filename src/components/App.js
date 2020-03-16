import React, {Component} from 'react';
import Application from './Application/Application.js';
import Footer from './Margins/Footer'
import Header from './Margins/Header'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

export default class App extends Component {
 
  constructor (props){
    super(props);
    
    this.state = {};

  } 

  render() {
    return (
        <div className="csu-branding">
          <Header/>
          <Application/>
          <Footer/>
        </div>
    );
  }



}
