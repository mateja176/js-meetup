import { gql } from 'apollo-boost';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Njam as NjamModel } from '../../api/src/models';

const query = gql`
  query {
    njam {
      id
      location
      description
      time
      participants {
        id
        name
        lastname
      }
      organizer {
        id
        name
        lastname
      }
      ordered
    }
  }
`;

interface NjamProps extends NjamModel, RouteComponentProps<{ id: string }> {}

const Njam: React.FC<WithApolloClient<NjamProps>> = ({
  match: {
    params: { id },
  },
  client,
}) => {
  const njam = client.readQuery({ query, variables: { id } });

  return <pre>{JSON.stringify(njam, null, 2)}</pre>;
};
export default withApollo(Njam);
