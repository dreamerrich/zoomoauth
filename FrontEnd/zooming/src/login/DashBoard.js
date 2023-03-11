import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../utils/SectionProps';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Avtar from './Avtar';


const propTypes = {
    ...SectionTilesProps.types
  }
  
  const defaultProps = {
    ...SectionTilesProps.defaults
  }
  
  const DashBoard = ({
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
    
    const [user, setUser] = useState([])
    const [email, setEmail] = useState([])
    const token = localStorage.getItem("authTokens")
    const accessToken = JSON.parse(token);
    
    
    const fetchData = () => {
        fetch('http://127.0.0.1:8000/profile',{ headers: new Headers({
            'Authorization': 'Bearer ' + accessToken.access, 
            'Content-Type': 'application/x-www-form-urlencoded'
        })},)
        .then(Response => {
            return Response.json()
        })
        .then(data => {
                setUser(data.username)
                setEmail(data.email)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    
    return (
        <section
            {...props}
            className={outerClasses}
        >
            <Header />
            <div className="container">
            {token ? 
                <div className={innerClasses}>
                    <div className='profile'>
                        <div>
                            <Avtar />
                        </div> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <div>
                             <h6>{user}</h6>
                             <p>{user}</p>
                        </div>
                    </div>
                    <div className='personal'>
                        <h6>Personal</h6>
                        <div className='meetingDetail'>
                            <p>phone</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>Not setted</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>Language</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>English</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>time zone</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>UTC+05:30</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>Date format</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>DD/MM/YY</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>time format</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>HH:MM</p>
                        </div>
                    </div>
                    <div className='meeting'>
                        <h6>Meeting</h6>
                        <div className='meetingDetail'>
                            <p>Personal Meeting ID</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>74056984523</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>Host Key</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>365748</p>
                        </div>
                    </div>
                    <div className='signin'>
                        <h6>Sign In</h6>
                        <div className='meetingDetail'>
                            <p>Mail ID</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>{email}</p>
                        </div>
                        <div className='meetingDetail'>
                            <p>Password</p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p>.........</p>
                        </div>
                    </div>
                </div>  
                : <div>No user find</div>}
          </div>
          <Footer/>
      </section>
)
        
};

DashBoard.propTypes = propTypes;
DashBoard.defaultProps = defaultProps;

export default DashBoard;