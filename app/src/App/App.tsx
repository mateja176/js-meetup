import React from 'react';
import Users from '../Users';
import Provider from './Provider';

const App: React.FC = () => (
  <Provider>
    <Users />
  </Provider>
);

export default App;
