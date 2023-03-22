import React, { useContext } from 'react';
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';
import AuthContext from '../login/AuthContext';
import Cookies from 'js-cookie';

const Home = () => {
  const { GetCode, Code, Tokens} = useContext(AuthContext)

  const handleloading = (e) => {
    e.preventDefault();
    if(!localStorage.getItem("logged_in"))  
    GetCode()
  }
  Code()
  const getparam = new URLSearchParams(window.location.search)
  const data = getparam.get('code')
  Cookies.set('code', data)
  
  const handletoken = (e) => {
    e.preventDefault();
    if(Cookies.get('code'))
    Tokens()
  }
  return (

      <div>
        
        <div onLoad={handleloading}>
          <Hero className="illustration-section-01" />
          <FeaturesTiles />
          <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
          <Testimonial topDivider />
          <Cta split />
        </div>
      
    </div>
     
  );
}

export default Home;