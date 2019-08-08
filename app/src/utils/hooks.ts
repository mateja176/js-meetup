import React from 'react';

const initialId = '';

export const useUserId = () => {
  const [userId, setUserId] = React.useState(initialId);

  React.useEffect(() => {
    const id = localStorage.getItem('userId');

    if (id) {
      setUserId(id);
    }
  }, [setUserId]);

  return userId;
};
