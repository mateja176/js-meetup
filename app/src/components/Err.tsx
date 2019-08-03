import Alert from 'antd/lib/alert';
import { ApolloError } from 'apollo-boost';
import React from 'react';

const Err: React.FC<ApolloError> = ({ name, message }) => (
  <Alert message={name} description={message} type="error" />
);

export default Err;
