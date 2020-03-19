import React, {Component} from 'react';
import Map from './Map';
import ControlPanel from './ControlPanel';

/* 
  Maintains the body of the application. Header and footer should
  not be included here.

  --- NOTE ---
  For confidentiality, the google maps API key has not been
  included in the public repository.

  To use this with Google, please provide your own Google API
  key in a file: src/GoogleApiKey.js, which contains only:

    export function getApiKey() { return <YOUR_KEY>; }
*/
export default class Application extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userActions: [],
      isWithinSession: false
    };


    this.updateUserActions = this.updateUserActions.bind(this);
    this.updateSessionToggle = this.updateSessionToggle.bind(this);
  }

  updateUserActions(newActions) {
    this.setState({'userActions': newActions});
  }

  updateSessionToggle(toggleValue) {
    this.setState({'isWithinSession': toggleValue});
  }


  render() {
    return (
        <div className="application-width">
          <Map          updateUserActions={this.updateUserActions}
                        userActions={this.state.userActions}
                        isWithinSession={this.state.isWithinSession}/>
          <ControlPanel updateUserActions={this.updateUserActions}
                        userActions={this.state.userActions}
                        isWithinSession={this.state.isWithinSession}
                        updateSessionToggle={this.updateSessionToggle}/>
        </div>
    );
  }
}
