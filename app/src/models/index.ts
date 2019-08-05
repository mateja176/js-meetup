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

const routeObject = {} as { [name in routeName]: name };

export const routeName = routeNames.reduce(
  (route, name) => ({ ...route, [name]: name }),
  routeObject,
);

export const routePath = routeNames.reduce(
  (route, name) => ({ ...route, [name]: urlJoin('/', name) }),
  routeObject,
);
