import React from 'react';
import { hot } from 'react-hot-loader';
import Njams from '../Njams';
import Provider from './Provider';

const App: React.FC = () => (
  <Provider>
    <Njams />
  </Provider>
);

export default hot(module)(App);
