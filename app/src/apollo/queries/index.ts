import { gql } from 'apollo-boost';
import { CompleteUser, NjamSummary } from './fragments';

export * from './fragments';

export const usersQuery = gql`
  {
    users {
      ...CompleteUser
    }
  }
  ${CompleteUser}
`;

export const njamsQuery = gql`
  query {
    njams {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;
