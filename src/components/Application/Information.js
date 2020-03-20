import React, {Component} from "react";
import {Button, Modal, ModalHeader, ModalBody} from "reactstrap";
import { FaInfo, FaPlus, FaMinus } from "react-icons/fa";

export default class Information extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({'modal': !this.state.modal});
  }

  static instructions() {
    return (
        <ol>
          <li>Click <Button className="btn-csu" size="sm">Start Session</Button>
            &nbsp; to start recording actions used to complete the task.
          </li>
          <li>Click on the map to bring it into focus (Otherwise, actions will not be recorded)</li>
          <li>Explore the map to find the goal specified using ONLY panning and zooming:
            <ul>
              <li><b>Panning</b>: You MUST use Fn + arrow key to pan. Please wait for the
                panning action to settle before panning again. Do NOT use only
                arrow keys, or click-drag the map to navigate.</li>
              <li><b>Zooming:</b> Click the given <FaPlus/> / <FaMinus/> buttons to zoom.</li>
              <li>You may need to re-click on the map to bring it back into focus.</li>
            </ul>
          </li>
          <li>Upon completing the goal, click <Button className="btn-csu" size="sm">End Session</Button></li>
          <li className="mt-1">Download the actions report by clicking <Button color="secondary" size="sm">Download Results</Button></li>
        </ol>
    );
  }

  render() {
    return (
        <Button className="btn-csu float-right" size="lg" onClick={this.toggleModal}>
          <FaInfo/>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Instructions</ModalHeader>
            <ModalBody>
              {Information.instructions()}
            </ModalBody>
          </Modal>
        </Button>
    );

  }
}