import React, { useContext, useEffect, useState } from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';
import AuthContext from '../login/AuthContext';
// import Cookies from 'js-cookie';

const Home = () => {
  const { GetCode } = useContext(AuthContext)
  const [url, setUrl] = useState("")

  useEffect(() => {
    GetCode()
    setUrl(window.location.href)
    localStorage.setItem('code', url)
  }, [])
  
  return (
    <div>
    <div>
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