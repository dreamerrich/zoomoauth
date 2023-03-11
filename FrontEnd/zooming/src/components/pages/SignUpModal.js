import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Signup from './Signup';

class SignUpModal extends Component {
    state = {
        modal: false
      };
    
      toggle = () => {
        this.setState(previous => ({
          modal: !previous.modal
        }));
      };

    render() {
        var title = "Sign Up";

        const signup = this.props.join
        var button = <Link to={"#"} onClick={this.toggle}>Sign Up </Link>;
        if (signup) {
            title = "Sign Up";
      
            button = (
              <Link to={"#"}
                className="float-center"
                onClick={this.toggle}
              >
                Sign Up
              </Link>
            );
          }
        return (
            <Fragment> 
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                    <ModalBody>
                    <Signup
                        toggle={this.toggle}
                    />
                    
                    </ModalBody>

                </Modal>
            </Fragment>
        )
    }
}

export default SignUpModal;