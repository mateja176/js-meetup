import { kebabCase } from 'lodash';
import moment from 'moment';
import urlJoin from 'url-join';
import { Njam, Scalars, User } from '../generated/graphql';

export type Users = User[];

export type Njams = Njam[];

export interface NjamFormValues
  extends Omit<Njam, 'id' | 'time' | 'organizer' | 'participants'> {
  time: moment.Moment;
  organizerId: Scalars['ID'];
  participantIds: Scalars['ID'][];
}

export const routeNames = ['njams', 'createNjam', 'users'] as const;

export type RouteName = typeof routeNames[number];

export const routeName = routeNames.reduce(
  (route, name) => ({ ...route, [name]: name }),
  {} as { [name in RouteName]: name },
);

export const routePath = Object.fromEntries(
  routeNames.map(name => [name, urlJoin('/', kebabCase(name))]),
) as Record<RouteName, string>;

export const publicRouteNames = ['signIn'] as const;

export type PublicRouteName = typeof publicRouteNames[number];

export const publicRouteName = publicRouteNames.reduce(
  (route, name) => ({ ...route, [name]: name }),
  {} as { [name in PublicRouteName]: name },
);

export const publicRoutePath = publicRouteNames.reduce(
  (route, name) => ({ ...route, [name]: urlJoin('/', kebabCase(name)) }),
  {} as Record<PublicRouteName, string>,
);
