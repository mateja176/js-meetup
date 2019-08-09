import { gql } from 'apollo-boost';
import { CompleteNjam, CompleteUser, NjamSummary } from './fragments';

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
  query($page: Int, $pageSize: Int) {
    njams(page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;

export const myNjamsQuery = gql`
  query($userId: ID!, $page: Int, $pageSize: Int) {
    myNjams(userId: $userId, page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;

export const njamQuery = gql`
  query($id: ID!) {
    njam(id: $id) {
      ...CompleteNjam
    }
  }
  ${CompleteNjam}
`;
