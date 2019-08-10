import { gql } from 'apollo-boost';
import { Njam } from '../../../../api/src/models';

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

export type NjamBase = Pick<Njam, 'id' | 'location' | 'time' | 'ordered'>;

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

export interface NjamSummary extends NjamBase {
  organizer: Pick<Njam['organizer'], 'id' | 'name'>;
  participants: Pick<Njam['participants'][0], 'id'>[];
}

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
