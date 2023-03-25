import React, { useContext, useEffect, useState, useRef } from 'react';
import AuthContext from '../../login/AuthContext';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Cookies from 'js-cookie';


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

const SignIn = ({
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

    

    return(
        <div>
            <div> 
            </div>
        </div>
    )

   }

SignIn.propTypes = propTypes;
SignIn.defaultProps = defaultProps;
    
export default SignIn;