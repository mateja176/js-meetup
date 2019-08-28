import moment from 'moment';
import { MutationCreateNjamArgs, User } from '../generated/graphql';
import { NjamFormValues } from '../models';

export * from './generators';
export * from './hooks';

// https://stackoverflow.com/questions/39969570/deprecation-warning-in-moment-js/51238958
export const createMoment = (time: string) => moment(new Date(time));

export const mapNjamFormValues = (userId: User['id']) => ({
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

export const toMappedObject = <Key extends string, MappedKey extends string>(
  mapKey: (key: Key) => MappedKey,
) => <MappedValue>(mapValue: (value: Key) => MappedValue) => (
  array: Array<Key>,
) =>
  array.reduce(
    (object, key) => ({ ...object, [mapKey(key)]: mapValue(key) }),
    {} as Record<MappedKey, MappedValue>,
  );
