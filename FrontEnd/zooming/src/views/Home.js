import React, { useContext } from 'react';
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';
import AuthContext from '../login/AuthContext';
import Cookies from 'js-cookie';

const Home = () => {
  const { GetCode } = useContext(AuthContext)

  const handleloading = (e) => {
    e.preventDefault();
    if(!localStorage.getItem("logged_in"))  
    GetCode()
  } 
  
  const getparam = new URLSearchParams(window.location.search)
  console.log("🚀 ~ file: Home.js:20 ~ Home ~ getparam:", getparam)
  const data = getparam.get('code')
  console.log("🚀 ~ file: Home.js:22 ~ Home ~ data:", data)
  Cookies.set('code', data)
  // document.cookie = `'code'=data; domain=localhost; path=localhost:8000/tokens`;
  // console.log(localStorage.getItem('code'));

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