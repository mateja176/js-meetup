import { gql } from 'apollo-boost';
import { Njam } from '../../../../api/src/models';
import { CompleteNjam } from '../queries/fragments';

export const createNjamMutation = gql`
  mutation(
    $location: String!
    $description: String
    $time: String!
    $organizerId: ID!
  ) {
    createNjam(
      location: $location
      description: $description
      time: $time
      organizerId: $organizerId
    ) {
      ...CompleteNjam
    }
  }
  ${CompleteNjam}
`;

export interface CreateNjamMutation {
  createNjam: Njam;
}

export const leaveNjamMutation = gql`
  mutation($userId: ID!, $njamId: ID!) {
    leaveNjam(userId: $userId, njamId: $njamId) {
      id
    }
  }
`;

export interface LeaveNjamResult {
  leaveNjam: Njam['id'];
}

export const joinNjamMutation = gql`
  mutation($userId: ID!, $njamId: ID!) {
    joinNjam(userId: $userId, njamId: $njamId) {
      id
    }
  }
`;

export interface JoinNjamResult {
  joinNjam: Njam['id'];
}
