import { Njam, User } from '../../../api/src/models';

export type Users = User[];

export interface UsersQuery {
  users: Users;
}

export interface NjamQuery {
  njam: Njam;
}

export interface NjamsQuery {
  njams: Njam[];
}
