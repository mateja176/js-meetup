import moment from 'moment';
import urlJoin from 'url-join';
import { Njam, Scalars } from '../../../api/src/models';

export * from './queries';

export interface NjamFormValues
  extends Omit<Njam, 'id' | 'time' | 'organizer' | 'participants'> {
  time: moment.Moment;
  organizerId: Scalars['ID'];
  participantIds: Scalars['ID'][];
}

export const routeNames = ['njams', 'createNjam'] as const;

export type routeName = typeof routeNames[number];

type RouteObject = { [name in routeName]: name };

export const routeName = routeNames.reduce(
  (_routeName, name) => ({ ..._routeName, [name]: name }),
  {} as RouteObject,
);

export const routePath = routeNames.reduce(
  (_routeName, name) => ({ ..._routeName, [name]: urlJoin('/', name) }),
  {} as RouteObject,
);
