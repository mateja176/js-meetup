import { User } from 'common/models';
import React from 'react';
import Provider from './Provider';

const user: User = {
  id: Math.round(Math.random() * 1000).toString(),
  name: 'Jake',
  lastname: 'Doe',
};

const App: React.FC = () => (
  <Provider>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </Provider>
);

export default App;
