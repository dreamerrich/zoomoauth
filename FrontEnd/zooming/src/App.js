import React, { useRef, useEffect } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';
import Plans from './components/sections/Plans&pricing';
import Product from './components/sections/Product';
import CreateMeeting from './components/video/CreateMeetings';
import UpdateMeeting from './components/video/UpdateMeeting';
import MeetingDetail from './components/video/MeetingDetail';
import ListMeeting from './components/video/ListMeetings';
import DashBoard from './login/DashBoard';
import { AuthProvider } from './login/AuthContext';
import SignIn from './components/pages/SignIn';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <div>
        <AuthProvider>
        <Switch>
          <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
          <Route exact path="/SignIn" component={SignIn} />
          <Route exact path="/plans" component={Plans} />
          <Route exact path="/Product" component={Product} />
          <Route exact path="/CreateMeeting" component={CreateMeeting} />
          <Route exact path="/MeetingDetail" component={MeetingDetail} />
          <Route exact path="/ListMeeting" component={ListMeeting} />
          <Route exact path="/Dashboard" component={DashBoard} />
          <Route exact path="/UpdateMeeting/:id" component={UpdateMeeting} />
        </Switch>
        </AuthProvider>
        </div>
      )} />
  );
}

export default App;