import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from '../Layout';
import Njams from '../Njams';
import Provider from './Provider';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Layout />
        <Switch>
          <Route path="/" component={Njams} />
        </Switch>
      </Provider>
    </BrowserRouter>
  );
};

export default hot(module)(App);
