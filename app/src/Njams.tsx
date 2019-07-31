import { Alert, List, Spin, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { Njam, User } from 'common/models';
import faker from 'faker';
import { keys as getKeys, range } from 'ramda';
import React from 'react';
import { Query } from 'react-apollo';

const generateUser = (): User => ({
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  lastname: faker.name.lastName(),
});

const generateCollection = <C extends User | Njam>(generator: () => C) => (
  min: number,
) => (max: number) => () =>
  range(min)(
    faker.random.number({
      min,
      max,
    }),
  ).map(generator);

const generateUsers = generateCollection(generateUser)(1)(5);

const generateNjam = (): Njam => {
  const organizer = generateUser();
  const participants = [organizer].concat(generateUsers());

  return {
    id: faker.random.uuid(),
    location: faker.random.word(),
    time: faker.date.recent(-7).toDateString(),
    ordered: faker.random.boolean(),
    organizer,
    description: faker.lorem.sentences(),
    participants,
  };
};

const generateNjams = generateCollection(generateNjam)(5)(10);

const njams = generateNjams();

const filterKeys: Partial<keyof Njam>[] = ['id', 'participants', 'description'];

const keys = getKeys(generateNjam()).filter(key => !filterKeys.includes(key));

const njamsQuery = gql`
  query {
    njams {
      id
      location
      description
      time
      participants {
        id
        name
        lastname
      }
      organizer {
        id
        name
        lastname
      }
      ordered
    }
  }
`;

const containerStyles: React.CSSProperties = {
  display: 'grid',
  gridAutoFlow: 'column',
  alignItems: 'center',
};

export interface NjamsProps {}

const Njams: React.FC<NjamsProps> = () => (
  <Query<{ njams: Njam[] }> query={njamsQuery}>
    {({ error, data }) => {
      if (data) {
        // const { njams } = data;

        return (
          <List
            header={
              <div style={containerStyles}>
                {keys.map(key => (
                  <Typography.Title key={key} level={2} style={{ margin: 0 }}>
                    {key}
                  </Typography.Title>
                ))}
              </div>
            }
            bordered
            dataSource={njams}
            renderItem={({
              ordered,
              organizer,
              id,
              participants,
              description,
              ...njam
            }) => {
              return (
                <List.Item onClick={() => console.log(njam)}>
                  <div style={{ ...containerStyles, width: '100%' }}>
                    {Object.values(njam)
                      .concat(ordered ? 'yes' : 'no')
                      .concat(organizer.name)
                      .map((value, i) => (
                        <Typography.Text key={i}>{value}</Typography.Text>
                      ))}
                  </div>
                </List.Item>
              );
            }}
          />
        );
      } else if (error) {
        const { message, name } = error;

        return <Alert message={name} description={message} type="error" />;
      } else {
        return <Spin size="large" />;
      }
    }}
  </Query>
);

export default Njams;
