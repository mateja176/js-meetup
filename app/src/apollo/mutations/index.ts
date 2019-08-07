import { gql } from 'apollo-boost';
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
