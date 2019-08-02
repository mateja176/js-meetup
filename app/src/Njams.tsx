import { Alert, Avatar, Col, List, Row, Spin, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { css } from 'emotion';
import faker from 'faker';
import { capitalize } from 'lodash';
import { keys as getKeys, range } from 'ramda';
import React from 'react';
import { Query } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import urlJoin from 'url-join';
import { Optional } from 'utility-types';
import { Njam, User } from '../../api/src/models';

const generateUser = (): User => ({
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  lastname: faker.name.lastName(),
});

type Constraints = Optional<
  Exclude<Required<Parameters<typeof faker.random.number>[0]>, undefined>,
  'precision'
>;

const generateCollection = <C extends User | Njam>(generator: () => C) => (
  constraints: Constraints,
) => () => {
  const length = faker.random.number(constraints);
  const generatedRange = range(0)(length);
  return generatedRange.map(generator);
};

const generateUsers = generateCollection(generateUser)({ min: 1, max: 5 });

const generateNjam = (): Njam => {
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

const generateNjams = generateCollection(generateNjam)({ min: 5, max: 10 });

const njams = generateNjams();

const filterKeys: Partial<keyof Njam>[] = ['id', 'participants', 'description'];

const keys = getKeys(generateNjam())
  .filter(key => !filterKeys.includes(key))
  .map(capitalize);

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

const statusCircleSize = 10;

const StatusCircle: React.FC<{ color: React.CSSProperties['color'] }> = ({
  color,
  children,
}) => (
  <>
    <Avatar
      style={{
        background: color,
        height: statusCircleSize,
        width: statusCircleSize,
        marginRight: 5,
      }}
    />
    {children}
  </>
);

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({ match: { path } }) => (
  <Query<{ njams: Njam[] }> query={njamsQuery}>
    {({ error, data }) => {
      if (data) {
        // const { njams } = data;

        return (
          <List
            header={
              <Row>
                {keys.map(key => {
                  return (
                    <Col span={6} key={key}>
                      <Typography.Title level={2} style={{ margin: 0 }}>
                        {key}
                      </Typography.Title>
                    </Col>
                  );
                })}
              </Row>
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
                <NavLink to={urlJoin(path, id)}>
                  <List.Item
                    className={css`
                      cursor: pointer;
                      &:hover {
                        background: #eee;
                      }
                    `}
                  >
                    {Object.values(njam)
                      .concat(
                        ordered ? (
                          <StatusCircle color="lightgreen">Yes</StatusCircle>
                        ) : (
                          <StatusCircle color="lightcoral">No</StatusCircle>
                        ),
                      )
                      .concat(organizer.name)
                      .map((value, i) => (
                        <Col span={6} key={i}>
                          <Typography.Text>{value}</Typography.Text>
                        </Col>
                      ))}
                  </List.Item>
                </NavLink>
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
