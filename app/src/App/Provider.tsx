import 'antd/dist/antd.css';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import env from '../env';

const client = new ApolloClient({
  uri: env.api,
});

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider = (props: ProviderProps) => (
  <ApolloProvider {...props} client={client} />
);

export default Provider;
