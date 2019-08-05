import { gql } from 'apollo-boost';

export const CompleteUser = gql`
  fragment CompleteUser on User {
    id
    name
    lastname
  }
`;
