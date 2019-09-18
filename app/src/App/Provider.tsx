import { ApolloProvider as ReactApolloProvider } from '@apollo/react-hooks';
import 'antd/dist/antd.css';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import env from '../env';

const client = new ApolloClient({
  uri: env.api,
});

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => (
  <BrowserRouter basename="/njam-njam">
    <ApolloProvider client={client}>
      <ReactApolloProvider client={client}>{children}</ReactApolloProvider>
    </ApolloProvider>
  </BrowserRouter>
);

export default Provider;
