import React, { Component, Fragment } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import JoinMeetForm from '../pages/JoinMeet';
import { Link } from 'react-router-dom';

class JoinMeeting extends Component {
    state = {
        modal: false
      };
    
      toggle = () => {
        this.setState(previous => ({
          modal: !previous.modal
        }));
      };
    render() {
        var title = "Join Meeting";

        const join = this.props.join
        var button = <Link to="/#" onClick={this.toggle}>Join</Link>;
        if (join) {
            title = "Joinning a new meet";
      
            button = (
              <Link
                to="/#"
                color="primary"
                onClick={this.toggle}
              >
                Join
              </Link>
            );
          }
        return (
            <Fragment> 
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                    <ModalBody>
                    <JoinMeetForm
                        toggle={this.toggle}
                    />
                    
                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}

export default JoinMeeting;