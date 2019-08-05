import moment from 'moment';
import { Njam, Scalars } from '../../../api/src/models';

export * from './queries';

export interface NjamFormValues
  extends Omit<Njam, 'id' | 'time' | 'organizer' | 'participants'> {
  time: moment.Moment;
  organizerId: Scalars['ID'];
  participantIds: Scalars['ID'][];
}

export const routeTexts = ['njams'] as const;

export type RouteText = typeof routeTexts[number];

export const routeText = routeTexts.reduce(
  (_routeText, text) => ({ ..._routeText, [text]: text }),
  {} as { [text in RouteText]: text },
);
