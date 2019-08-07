import { gql } from 'apollo-boost';

export const CompleteUser = gql`
  fragment CompleteUser on User {
    id
    name
    lastname
  }
`;

export const NjamBase = gql`
  fragment NjamBase on Njam {
    id
    location
    time
    ordered
  }
`;

export const NjamSummary = gql`
  fragment NjamSummary on Njam {
    ...NjamBase
    organizer {
      id
      name
    }
    participants {
      id
    }
  }
  ${NjamBase}
`;

export const CompleteNjam = gql`
  fragment CompleteNjam on Njam {
    ...NjamBase
    description
    organizer {
      id
      name
      lastname
    }
    participants {
      id
      name
      lastname
    }
  }
  ${NjamBase}
`;
