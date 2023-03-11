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
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )} />
  );
}

export default AppRoute;