import { User } from 'common/models';
import React from 'react';

const user: User = {
  id: Math.round(Math.random() * 1000).toString(),
  name: 'Jake',
  lastname: 'Doe',
};

const App: React.FC = () => {
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export default App;
