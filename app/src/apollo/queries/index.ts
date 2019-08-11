import { gql } from 'apollo-boost';
import { Njam, Query } from '../../../../api/src/models';
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

type _NjamsQuery<Key extends string> = Record<Key, NjamSummaries>;

export type NjamsQuery = _NjamsQuery<'njams'>;

export const myNjamsQuery = gql`
  query($userId: ID!, $page: Int, $pageSize: Int) {
    myNjams(userId: $userId, page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
  }
  ${NjamSummary}
`;

export type MyNjamsQuery = _NjamsQuery<'myNjams'>;

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

export const njamsCountQuery = gql`
  {
    njamsCount
  }
`;

export interface NjamsCountQuery {
  njamsCount: Query['njamsCount'];
}

export const myNjamsCountQuery = gql`
  query($userId: ID!) {
    njamsCount(userId: $userId)
  }
`;

export interface myNjamsCountQuery {
  myNjamsCount: Query['myNjamsCount'];
}
