import { mapValues } from 'lodash';
import moment from 'moment';
import { Njam, Scalars, User } from '../generated/graphql';
import { toAbsolutePath } from '../utils';

export const appName = 'Njam njam';

export type Users = User[];

export type Njams = Njam[];

export interface NjamFormValues
  extends Omit<Njam, 'id' | 'time' | 'organizer' | 'participants'> {
  time: moment.Moment;
  organizerId: Scalars['ID'];
  participantIds: Scalars['ID'][];
}

export const routeName = {
  njams: 'njams',
  createNjam: 'createNjam',
  users: 'users',
};

export const routePath = mapValues(routeName, toAbsolutePath);

export const publicRouteName = {
  signIn: 'signIn',
};

export const publicRoutePath = mapValues(publicRouteName, toAbsolutePath);
