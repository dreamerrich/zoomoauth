import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';
import SignInModal from '../pages/SignInModal';
import AuthContext from '../../login/AuthContext';

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool
}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}


const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {
  
  const {logoutUser} = useContext(AuthContext)
  const handleClick = async e => {
    e.preventDefault();
    logoutUser();
  };

  const [isActive, setIsactive] = useState(false);
  const nav = useRef(null);
  const hamburger = useRef(null);
  const token = localStorage.getItem("authTokens");
  
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
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  }  
  
  const classes = classNames(
    'site-header',
    bottomOuterDivider && 'has-bottom-divider',
    className
    );

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            'site-header-inner',
            bottomDivider && 'has-bottom-divider'
          )}>
          <Logo />
          {!hideNav &&
            <div>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    'header-nav',
                    isActive && 'is-active'
                  )}>
                <div className="header-nav-inner">
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                      <li>
                      <Link to="/ListMeeting" onClick={openMenu}>Meetings</Link>
                      </li>
                      <li>
                        <Link to="/CreateMeeting" onClick={openMenu}>Create Meeting</Link>
                      </li>
                      <li>
                        <a href="https://zoom.us/join">Join</a>
                      </li>
                      <li>
                        <Link to="/Product" onClick={openMenu}>Products</Link>
                      </li>
                      <li>
                        <Link to="/Plans" onClick={openMenu}>Plans & Pricing</Link>
                      </li>
                  </ul>
                 
                  {!hideSignin &&
                    <ul className="list-reset header-nav-right">
                   {token ? 
                    <li>
                      <Link to="#" onClick={handleClick}>Logout</Link>
                    </li>
                      : 
                    <li>
                      <Link to="#" onClick={openMenu}><SignInModal/></Link> 
                    </li>
                   } 
                    </ul>}
                    
                </div>
              </nav>
            </div>}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;