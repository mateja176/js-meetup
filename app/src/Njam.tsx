import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Njam as NjamModel } from '../../api/src/models';
import { Err, Loading } from './components';

const query = gql`
  query($id: ID!) {
    njam(id: $id) {
      id
      location
      time
      ordered
      organizer {
        id
        name
        lastname
      }
      description
      participants {
        id
        name
        lastname
      }
    }
  }
`;

interface NjamProps
  extends NjamModel,
    Pick<RouteComponentProps<{ id: string }>, 'match'> {}

const Njam: React.FC<NjamProps> = ({
  match: {
    params: { id },
  },
}) => {
  const { data, error } = useQuery(query, {
    variables: { id },
    fetchPolicy: 'cache-first',
  });

  if (data) {
    const { njam } = data;

    return <pre>{JSON.stringify(njam, null, 2)}</pre>;
  } else if (error) {
    return <Err {...error} />;
  } else {
    return <Loading />;
  }
};
export default Njam;
