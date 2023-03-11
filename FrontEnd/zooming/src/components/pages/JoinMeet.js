import React, { Fragment, useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
// import ZoomingModal from '../video/ZoomingModal';
import { useHistory } from "react-router-dom";

export default function JoinMeeting() {
    const history = useHistory();
    const [ meetingId, setMeetingId ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ userName, setuserName] = useState(null)
    const [ enableSubmit, setEnableSubmit] = useState(false)


    useEffect(
        (ar) => {
            if(meetingId && password && userName) {
                setEnableSubmit(true);
            } else {
                setEnableSubmit(false);
            }
        },
        [meetingId, password, userName]
    )
    
    const videoCall = (role) => {
        const url = `/video-call?username=${userName}&meetingNumber=${meetingId}&password=${password}&role=${role}`;
        history.push(url)
    }

    const [ checked, setChecked] = useState(false);
    const handleChange = (e) => {
        setChecked(!checked);

    };

        return(
            <Fragment>
            <Form>
                <FormGroup>
                    <Input
                        type="text"
                        name="meetingId"
                        placeholder='Enter Meeting ID or personal Link name'
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                    />&nbsp; 
                    <Input
                        type="text"
                        name="name"
                        placeholder='Enter Your Name'
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)}
                    />&nbsp; 
                    <Input
                        type="text"
                        name="password"
                        placeholder='Passcode'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />&nbsp; 
                    <div style={{textAlign:"left"}}>
                    <br />
                    <input 
                    type="checkbox"
                    name="connect"
                    onChange={handleChange}
                    />
                    <Label for="connect">&nbsp;&nbsp;Do not connect my audio</Label>
                    <br />
                    <input 
                    type="checkbox"
                    name="video"
                    onChange={handleChange}
                    />
                    <Label for="video">&nbsp;&nbsp;Turn off my video</Label>
                    <br />
                    <p>By clicking "join", you agree to our <span style={{color:'blue'}}>Terms of service</span> and <span style={{color:'blue'}}>Privacy Statement</span></p>
                    </div>
                </FormGroup>
                <Button onClick={(e) => videoCall(1)} color="primary" disabled={!enableSubmit}>Join</Button> &nbsp; &nbsp; 
                <Button onClick={(e) => videoCall(0)} color="light">Cancel</Button>
                </Form>
            </Fragment>

        )
}
