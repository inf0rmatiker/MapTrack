import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody} from "reactstrap";
import Information from "./Information";

/*
  Holds buttons to control sessions and manage report downloads.
 */
export default class ControlPanel extends Component {

  constructor(props) {
    super(props);

    // Binds
    this.getActionsAsString = this.getActionsAsString.bind(this);
    this.clearUserActions = this.clearUserActions.bind(this);
    this.toggleSession = this.toggleSession.bind(this);
    this.saveActionsAsFile = this.saveActionsAsFile.bind(this);
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

  /*
    Pure cancer. Uses javascript Blob object to save a file, with compatibility
    across most major browsers. Read more on blobs here:
    https://developer.mozilla.org/en-US/docs/Web/API/Blob

    Code taken from Awesomeness01 on StackOverflow:
    https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
   */
  saveActionsAsFile() {
    let filename = "userActions.json";
    let stringifiedActions = JSON.stringify(this.props.userActions);

    var file = new Blob([stringifiedActions], {type: 'application/json'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
      var a = document.createElement("a"),
          url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
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
            <Button size="lg" active={this.props.userActions.length > 0}
                    onClick={this.saveActionsAsFile}
                    disabled={this.props.userActions.length === 0}>
              Download Results
            </Button>
          </ButtonGroup>
          <Information/>
        </CardBody>
      </Card>
    );
  }


}