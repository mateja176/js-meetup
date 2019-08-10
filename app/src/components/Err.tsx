import Alert from 'antd/lib/alert';
import { ApolloError } from 'apollo-boost';
import React from 'react';

export interface ErrProps extends ApolloError {}

const Err: React.FC<ErrProps> = ({ name, message }) => (
  <Alert message={name} description={message} type="error" />
);

export default Err;
