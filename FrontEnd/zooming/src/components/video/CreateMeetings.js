import React, { useContext,useState } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import AuthContext from '../../login/AuthContext';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Button from '../elements/Button';
import Header from '../layout/Header';
import zones from '../../data/timezones';


const propTypes = {
  ...SectionTilesProps.types
}
  
const defaultProps = {
  ...SectionTilesProps.defaults
}
  
const CreateMeeting = ({
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
    
    const [data, setData] = useState({
      id: '',
      topic: '',
      start_time:'',
      duration:'',
      timezone:''
    })

    const changeHandler = e => {
        setData({...data, [e.target.name]: e.target.value})
    } 

    const { CreateMeeting } = useContext(AuthContext);

    const token = localStorage.getItem("authTokens");

  const handleSubmit = (e) => {
    e.preventDefault();
    CreateMeeting(data.topic, data.start_time, data.duration, data.timezone);
    }

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
        <h3>Schedule Meetings</h3>
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
                          onChange={changeHandler}
                          required
                      />&nbsp;
                    </div><br />

                    <div className='when'>
                      <Label>When</Label> &nbsp; &nbsp; &nbsp;

                        <Input
                            type="datetime-local"
                            name="start_time"
                            id="start_time"
                            placeholder='date'
                            onChange={changeHandler}
                            required
                        />
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
                          onChange={changeHandler}  
                          required
                        >&nbsp; &nbsp;
                        {zones.map((timezone) => (
                          <option value={timezone}>{timezone}</option>
                        ))
                        }
                        </select>
                    </div><br />
                    
                   
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
    
CreateMeeting.propTypes = propTypes;
CreateMeeting.defaultProps = defaultProps;

export default CreateMeeting;