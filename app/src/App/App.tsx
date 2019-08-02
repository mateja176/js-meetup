import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import Provider from './Provider';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Layout />
      </Provider>
    </BrowserRouter>
  );
};

export default hot(module)(App);
