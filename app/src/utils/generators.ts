import faker from 'faker';
import { range } from 'ramda';
import { Optional } from 'utility-types';
import { Njam, User } from '../../../api/src/models';

export const generateUser = (): User => ({
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  lastname: faker.name.lastName(),
});

type Constraints = Optional<
  Exclude<Required<Parameters<typeof faker.random.number>[0]>, undefined>,
  'precision'
>;

export const generateCollection = <C extends User | Njam>(
  generator: () => C,
) => (constraints: Constraints) => () => {
  const length = faker.random.number(constraints);
  const generatedRange = range(0)(length);
  return generatedRange.map(generator);
};

export const generateUsers = generateCollection(generateUser)({
  min: 1,
  max: 5,
});

export const generateNjam = (): Njam => {
  const organizer = generateUser();
  const participants = [organizer].concat(generateUsers());

  return {
    id: faker.random.uuid(),
    location: faker.address.streetName(),
    time: faker.date.recent(-7).toDateString(),
    ordered: faker.random.boolean(),
    organizer,
    description: faker.lorem.sentences(),
    participants,
  };
};

export const generateNjams = generateCollection(generateNjam)({
  min: 5,
  max: 10,
});
