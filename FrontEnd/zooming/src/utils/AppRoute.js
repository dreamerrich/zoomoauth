import React from 'react';
import { Route } from 'react-router-dom';

const AppRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}) => {

  Layout = (Layout === undefined) ? props => (<div>{props.children}</div>) : Layout;

  return (
    <Route    
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )} {...rest}/>
  );
}

export default AppRoute;