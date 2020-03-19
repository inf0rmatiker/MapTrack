import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody} from "reactstrap";

/*
  Holds the Google Maps instance, and provides event listeners
  for the Google Maps API to track user actions.
 */
export default class ControlPanel extends Component {

  constructor(props) {
    super(props);

    // Binds
    this.getActionsAsString = this.getActionsAsString.bind(this);
    this.clearUserActions = this.clearUserActions.bind(this);
    this.toggleSession = this.toggleSession.bind(this);
  }

  getActionsAsString() {
    if (this.props.userActions) {
      let actions = this.props.userActions;
      let collectedActions = "";
      for (let i = 0; i < actions.length; i++) {
        let actionStr = actions[i].action;
        collectedActions += actionStr;
        if (i !== (actions.length - 1)) {
          collectedActions += ",";
        }
      }

      return collectedActions;
    }
  }

  clearUserActions() {
    this.props.updateUserActions([]);
  }

  toggleSession() {
    if (!this.props.isWithinSession) {
      this.clearUserActions(); // Clear user actions before starting a new session
    }
    else {
      console.log(this.getActionsAsString());
    }
    this.props.updateSessionToggle(!this.props.isWithinSession);
  }

  render() {
    let sessionButtonValue = this.props.isWithinSession ? "End Session" : "Start Session";

    return (
      <Card>
        <CardBody>
          <ButtonGroup>
            <Button className='btn-csu' size="lg" onClick={this.toggleSession}>
              {sessionButtonValue}
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
    );
  }


}