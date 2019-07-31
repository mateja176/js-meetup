import React from 'react';
import { hot } from 'react-hot-loader';
import Users from '../Users';
import Provider from './Provider';

const App: React.FC = () => (
  <Provider>
    <Users />
  </Provider>
);

export default hot(module)(App);
