import { gql } from 'apollo-boost';
import { Njam } from '../../../../api/src/models';
import { Njams, Users } from '../../models';
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

export interface UsersQuery {
  users: Users;
}

export const njamsQuery = gql`
  query($page: Int, $pageSize: Int) {
    njams(page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;

export interface NjamsQuery {
  njams: Njams;
}

export const myNjamsQuery = gql`
  query($userId: ID!, $page: Int, $pageSize: Int) {
    myNjams(userId: $userId, page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;

export interface MyNjamsQuery {
  myNjams: Njams;
}

export const njamQuery = gql`
  query($id: ID!) {
    njam(id: $id) {
      ...CompleteNjam
    }
  }
  ${CompleteNjam}
`;

export interface NjamQuery {
  njam: Njam;
}
