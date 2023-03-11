import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from '../layout/Header';
import { Button, Table, Input } from 'reactstrap';
import { useHistory } from "react-router-dom";
import AuthContext from '../../login/AuthContext';

const propTypes = {
    navPosition: PropTypes.string,
    bottomOuterDivider: PropTypes.bool,
    bottomDivider: PropTypes.bool
  }
  
  const defaultProps = {
    navPosition: '',
    bottomOuterDivider: false,
    bottomDivider: false
  }
  
  const ListMeeting = ({
    className,
    navPosition,
    topOuterDivider,
    bottomOuterDivider,
    topDivider,
    bottomDivider,
    hasBgColor,
    invertColor,
    pushLeft,
    ...props
  }) => {
  
    const history = useHistory()
    const outerClasses = classNames(
      'testimonial section',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    );
    
    const [isActive, setIsactive] = useState(false);
    const nav = useRef(null);
    
    useEffect(() => {
        isActive && openMenu();
        document.addEventListener('keydown', keyPress);
        document.addEventListener('click', clickOutside);
        return () => {
          document.removeEventListener('keydown', keyPress);
          document.removeEventListener('click', clickOutside);
          closeMenu();
        };
      });  
      
    const openMenu = () => {
        document.body.classList.add('off-nav-is-active');
        nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
        setIsactive(true);
    }
      
    const closeMenu = () => {
        document.body.classList.remove('off-nav-is-active');
        nav.current && (nav.current.style.maxHeight = null);
        setIsactive(false);
    }
      
    const keyPress = (e) => {
        isActive && e.keyCode === 27 && closeMenu();
    }
      
    const clickOutside = (e) => {
        if (!nav.current) return
        closeMenu();
    }

    const innerClasses = classNames(
      'testimonial-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider'
    );
    
    const { DeleteMeeting } = useContext(AuthContext);

    const [search, setSearch] = useState('')
    const [meeting, setMeeting] = useState([])
    const token = localStorage.getItem("authTokens");
    const Token = JSON.parse(token);
    
    const fetchData = () => {
        fetch('http://127.0.0.1:8000/meeting',{ 
            headers: new Headers({
            'Authorization': 'Bearer ' + Token.access, 
            'Content-Type': 'application/x-www-form-urlencoded'
        })},)
        .then(Response => {
            return Response.json()
        })
        .then(data => {
                setMeeting(data)
            })
        }

    useEffect(() => {
        fetchData()
    }, [])

    let data =("")
    const dataid = (e) => {
        data = localStorage.setItem("data", JSON.stringify(e))
        history.push(`/UpdateMeeting/${e}`)
    }

    let delete_id =("")
    const d_id = (e) => {
        delete_id = localStorage.setItem("delete_id", JSON.stringify(e))
        DeleteMeeting()
        history.push(`/ListMeeting`)
    }
    localStorage.removeItem(d_id)
      
    return (
        <section
            {...props}
            className={outerClasses}
        >
            <Header />
                <div className="container">
                    <div className={innerClasses}>
                        <div>
                            <h3>Meetings</h3>
                        </div>
                            <hr />
                            <Input
                                type="text"
                                name="topic"
                                id="topic"
                                placeholder='Quick search with topic'
                                onChange={e => setSearch(e.target.value)}
                                required
                            />&nbsp; 
                            {Token ?
                            <Table>
                                <thead>
                                    <tr>
                                        <th><h4>Start time</h4></th>
                                        <th><h4>Topic</h4></th>  
                                    </tr>
                                </thead>
                                <tbody>
                                { search ? 
                                    (meeting.filter(d=>d.topic.includes(search.toLowerCase())).map((i)=> { 
                                        return (
                                            <tr key={i.id}>
                                                <td><h6>{i.start_time}</h6></td>
                                                <td><h6 key={i.topic}>{i.topic}</h6><br/>{i.meeting_id}</td>
                                                <td><Button onClick={()=>dataid(i.id)}>Edit</Button></td>
                                                <td><Button className='btn btn-danger' onClick={()=>d_id(i.id)}>Delete</Button></td>
                                            </tr>
                                        )}))
                                        :
                                        (meeting.map((i)=> {
                                            return (
                                                <tr>
                                                    <td><h6>{i.start_time}</h6></td>
                                                    <td><h6 key={i.topic}>{i.topic}</h6><br/>{i.meeting_id}</td>
                                                    <td><Button onClick={()=>dataid(i.id)}>Edit</Button></td>
                                                    <td><Button className='btn btn-danger' onClick={()=>d_id(i.id)}>Delete</Button></td>
                                                </tr>
                                            )
                                        }))
                                }
                                    <tr>
                                    </tr>
                                </tbody>
                            </Table> 
                            :
                            <div>
                                <h6>Please Login to view Your past meeting.</h6>
                            </div>
                            }
                    </div>
                </div> 
          
        </section>
    )
    
}
ListMeeting.propTypes = propTypes;
ListMeeting.defaultProps = defaultProps;

export default ListMeeting;