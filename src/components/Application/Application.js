import React, {Component} from 'react';
import Map from './Map';
import {Card, CardBody, CardHeader, Button} from 'reactstrap';

const DEBUG = true;

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
      userActions: []
    };


    this.addAction = this.addAction.bind(this);
    this.getActionsAsString = this.getActionsAsString.bind(this);
  }

  addAction(action) {
    let actions = this.state.userActions;
    actions.push(action);
    this.setState({'userActions': actions});
  }

  getActionsAsString() {
    if (this.state.userActions) {
      let actions = this.state.userActions;
      let collectedActions = "";
      for (let i = 0; i < actions.length; i++) {
        let actionStr = actions[i].action;
        collectedActions += actionStr;
        if (i !== (actions.length - 1)) {
          collectedActions += ",";
        }
      }

      if (DEBUG) console.log(collectedActions);

      return collectedActions;
    }
  }


  render() {
    return (
        <div className="application-width">
          <Map addAction={this.addAction}/>
          <Card>
            <CardHeader>
              Control Panel
            </CardHeader>
            <CardBody>
              <Button className='btn-csu' size="lg" onClick={this.getActionsAsString}>See Results</Button>
            </CardBody>
          </Card>
        </div>
    );
  }
}
