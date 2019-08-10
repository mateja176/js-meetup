import { gql } from 'apollo-boost';
import { Njam } from '../../../../api/src/models';
import { Users } from '../../models';
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

export type NjamSummaries = NjamSummary[];

export interface NjamsQuery {
  njams: NjamSummaries;
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
  myNjams: NjamSummaries;
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
