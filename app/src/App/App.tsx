import React from 'react';
import { hot } from 'react-hot-loader';
import Layout from '../Layout';
import Provider from './Provider';

const App: React.FC = () => {
  return (
    <Provider>
      <Layout />
    </Provider>
  );
};

export default hot(module)(App);
