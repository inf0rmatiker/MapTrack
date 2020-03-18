import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Header from './Margins/Header';
import Application from './Application/Application';
import Footer from './Margins/Footer';


export default class App extends Component {
 
  constructor (props){
    super(props);
    
    this.state = {
    };

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
