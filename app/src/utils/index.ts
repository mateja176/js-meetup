import { kebabCase } from 'lodash';
import moment from 'moment';
import urlJoin from 'url-join';
import { MutationCreateNjamArgs, Njam, User } from '../generated/graphql';
import { NjamFormValues } from '../models';

export * from './generators';
export * from './hooks';

export const toAbsolutePath = (s: string) => urlJoin('/', kebabCase(s));

// https://stackoverflow.com/questions/39969570/deprecation-warning-in-moment-js/51238958
export const createMoment = (time: string) => moment(new Date(time));

export const formValuesToNjam = (userId: User['id']) => ({
  time,
  participantIds,
  ...values
}: NjamFormValues) => {
  return {
    ...values,
    time: time.toDate().toString(),
    participantIds: participantIds.concat(userId),
  } as MutationCreateNjamArgs;
};

export const njamToFormValues = ({
  time,
  organizer,
  participants,
  ...njam
}: Njam): NjamFormValues => ({
  ...njam,
  time: createMoment(time),
  organizerId: organizer.id,
  participantIds: participants.map(({ id }) => id),
});
