import React, { Component, Fragment } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import SignIn from './SignIn';
import { Link } from 'react-router-dom';
import { AuthProvider } from '../../login/AuthContext';

class SignInModal extends Component {
    state = {
        modal: false
      };
    
      toggle = () => {
        this.setState(previous => ({
          modal: !previous.modal
        }));
      };
    render() {
        
        var title = "Sign In";
        const signin = this.props.join
        var button = <Link to={"#"} onClick={this.toggle}>Sign In</Link>;
        
        if (signin) {
            title = "Sign In";

            button = (
              <Link to={"#"}
                onClick={this.toggle}
              >
                Sign In
              </Link>
            )
          }
        return (
            <Fragment> 
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                    <ModalBody>
                    <AuthProvider>
                    <SignIn
                        toggle={this.toggle}
                    />
                    </AuthProvider>
                    </ModalBody>

                </Modal>
            </Fragment>
        )
    }
}

export default SignInModal;
           