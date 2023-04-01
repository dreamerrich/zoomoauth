import React, { useContext,useState, useEffect } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import AuthContext from '../../login/AuthContext';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Button from '../elements/Button';
import Header from '../layout/Header';
import zones from '../../data/timezones';
import moment from 'moment';

const propTypes = {
  ...SectionTilesProps.types
}
  
const defaultProps = {
  ...SectionTilesProps.defaults
}
  
const UpdateMeeting = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  
    const outerClasses = classNames(
      'testimonial section',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    );
  
    const innerClasses = classNames(
      'testimonial-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider'
    );

    const changeHandler = e => {
        setMeetingData({...meetingdata, [e.target.name]: e.target.value})
    } 

    const { UpdateMeeting } = useContext(AuthContext);

    const token = localStorage.getItem("authTokens");
    const accessToken = JSON.parse(token);
    const auth = accessToken.access_token
    

    const id = localStorage.getItem("id")

    const [ meetingdata, setMeetingData ] = useState([])

    const get_meeting = async e => {
      fetch('http://127.0.0.1:8000/updateget/'+id,{ 
        headers: {
          'Authorization': 'Bearer ' + auth, 
          'Content-Type': 'application/json'
        }})
        .then(Response => {
            return Response.json()
        })
        .then(data => {
               
                setMeetingData(data)
              })
            }

    useEffect(() => {
      get_meeting()
    }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
      const updated_date = moment(meetingdata.start_time).format('yyyy-MM-DDTHH:mm:ss')
      UpdateMeeting(meetingdata.topic,updated_date,meetingdata.duration,meetingdata.timezone)
      localStorage.removeItem('id')
    }

  

  // getFormattedDate(meetingdata.start_time)
  // console(">>>>>>", getFormattedDate)

    return (
      <section
      {...props}
      className={outerClasses}
      >
      <div>
      <Header/>
        <div className="container">
        <div className={innerClasses}>
        <div>
        <h3>Re-Schedule Meeting</h3>
        </div>
        { token ?
            <div className='meetingForm'>
              <Form style={{textAlign:"left"}} onSubmit={handleSubmit}>
                <FormGroup>
                    <div className='topic'>
                      <Label>Topic</Label> &nbsp; &nbsp; &nbsp;
                      <Input
                          type="text"
                          name="topic"
                          id="topic"
                          placeholder='topic'
                          value={meetingdata.topic}
                          onChange={changeHandler}
                          required
                      />&nbsp;
                    </div><br />

                    <div className='when'>
                      <Label>When</Label> &nbsp; &nbsp; &nbsp;
                      { 
                        meetingdata.start_time &&
                        <Input
                            type="datetime-local"
                            name="start_time"
                            id="start_time"
                            placeholder='date'
                            value={meetingdata ? meetingdata.start_time ? meetingdata.start_time.split(':')[0]+':'+meetingdata.start_time.split(':')[1]:'':''}
                            onChange={changeHandler}
                            required
                        />
                      }
                          <select>
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                          </select>
                    </div> <br />
                    &nbsp; &nbsp;

                    <div className='duration'>
                        <Label>Duration</Label> &nbsp; &nbsp; &nbsp;
                        <Input
                                type="number"
                                name="duration"
                                id="duration"
                                placeholder='duration'
                                value={meetingdata.duration}
                                onChange={changeHandler}
                                required
                        >&nbsp; &nbsp;
                        </Input> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <br />

                    <div className='timezone'> 
                        <Label>TimeZone</Label>&nbsp; &nbsp; &nbsp;
                        <select
                        className='select'
                          type='text'
                          name='timezone'
                          id='timezone'
                          placeholder='timezone'
                          value={meetingdata.timezone}
                          onChange={changeHandler}  
                          required
                        >&nbsp; &nbsp;
                        {zones.map((timezone) => (
                          <option value={timezone}>{timezone}</option>
                        ))
                        }
                        </select>
                    </div>
                    <br />
                    <Button type='submit'>Save</Button>&nbsp;&nbsp;&nbsp;
                    <Button type='submit'>Cancel</Button>
                </FormGroup>
              </Form>
            </div>
          :
            <div>
              <h4>Please Login first</h4>
            </div>
          }
        </div> 
        </div>
      </div>
    </section>
  )

}
    
UpdateMeeting.propTypes = propTypes;
UpdateMeeting.defaultProps = defaultProps;

export default UpdateMeeting;