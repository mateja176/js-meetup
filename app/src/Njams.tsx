import { Button, Col, List, Row, Tabs, Typography } from 'antd';
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import { always } from 'ramda';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Box } from 'rebass';
import urlJoin from 'url-join';
import { Njam } from '../../api/src/models';
import {
  joinNjamMutation,
  JoinNjamResult,
  leaveNjamMutation,
  LeaveNjamResult,
  NjamActionParams,
  njamsQuery,
} from './apollo';
import { Err, Loading, MutationResult, StatusCircle } from './components';
import { NjamsQuery } from './models';
import { createMoment, useUserId } from './utils';

const LeaveNjam: React.FC<NjamActionParams> = props => {
  return (
    <Mutation<LeaveNjamResult> mutation={leaveNjamMutation}>
      {(leaveNjam, mutationResult) => {
        const base = (
          <Button
            onClick={e => {
              e.preventDefault();

              leaveNjam({
                variables: props,
              });
            }}
          >
            Leave
          </Button>
        );
        return (
          <MutationResult
            {...mutationResult}
            Data={() => <JoinNjam {...props} />}
          >
            {base}
          </MutationResult>
        );
      }}
    </Mutation>
  );
};

const JoinNjam: React.FC<NjamActionParams> = props => (
  <Mutation<JoinNjamResult> mutation={joinNjamMutation}>
    {(joinNjam, mutationResult) => {
      const base = (
        <Button
          onClick={e => {
            e.preventDefault();

            joinNjam({
              variables: props,
            });
          }}
        >
          Join
        </Button>
      );

      return (
        <MutationResult
          {...mutationResult}
          Data={() => <LeaveNjam {...props} />}
        >
          {base}
        </MutationResult>
      );
    }}
  </Mutation>
);

const keys = ['location', 'time', 'organizer', 'ordered', 'you'] as const;
const columns = keys.map(capitalize);

const smallerSpan = 4;
const largerSpan = 5;

const Column: React.FC = ({ children }) => (
  <Col span={largerSpan}>
    <Typography.Text ellipsis>{children}</Typography.Text>
  </Col>
);

const initialFilter = always(true);

type NjamFilter = (njam: Njam) => boolean;

interface FilterType {
  name: string;
  filter: NjamFilter;
}

const oneHourInThePast = moment().subtract(1, 'hour');

const filterTypes: FilterType[] = [
  { name: 'all', filter: initialFilter },
  {
    name: 'upcoming',
    filter: ({ time }) => createMoment(time).isAfter(moment()),
  },
  {
    name: 'inProgress',
    filter: ({ time }) => {
      const momentTime = createMoment(time);

      return momentTime.isBetween(oneHourInThePast, moment());
    },
  },
  {
    name: 'past',
    filter: ({ time }) => {
      const momentTime = createMoment(time);

      return momentTime.isBefore(oneHourInThePast);
    },
  },
];

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({ match: { path } }) => {
  const [{ filter }, _setFilter] = React.useState<{ filter: NjamFilter }>({
    filter: initialFilter,
  });
  const setFilter = (filter: NjamFilter) => _setFilter({ filter });

  const userId = useUserId();

  return (
    <Query<NjamsQuery> query={njamsQuery} fetchPolicy="cache-and-network">
      {({ error, data, loading }) => {
        if (loading) {
          return <Loading />;
        } else if (error) {
          return <Err {...error} />;
        } else {
          const { njams } = data!;

          return (
            <Box>
              <Tabs
                onChange={filterName =>
                  setFilter(
                    filterTypes.find(({ name }) => filterName === name)!.filter,
                  )
                }
              >
                {filterTypes.map(({ name, filter }) => (
                  <Tabs.TabPane key={name} tab={startCase(name)} />
                ))}
              </Tabs>
              <List
                header={
                  <Row>
                    {columns.map((key, i) => {
                      return (
                        <Col
                          span={i === 3 ? smallerSpan : largerSpan}
                          key={key}
                        >
                          <Typography.Title level={2} style={{ margin: 0 }}>
                            {key}
                          </Typography.Title>
                        </Col>
                      );
                    })}
                  </Row>
                }
                bordered
                dataSource={njams.filter(filter)}
                renderItem={({
                  id,
                  location,
                  time,
                  ordered,
                  organizer,
                  participants,
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
                        <Column>{location}</Column>
                        <Column>{time}</Column>
                        <Column>{organizer.name}</Column>
                        <Col span={smallerSpan}>
                          {ordered ? (
                            <StatusCircle color="lightgreen">Yes</StatusCircle>
                          ) : (
                            <StatusCircle color="lightcoral">No</StatusCircle>
                          )}
                        </Col>
                        <Col span={largerSpan}>
                          {organizer.id === userId ? (
                            <Typography.Text>Author</Typography.Text>
                          ) : participants
                              .map(({ id }) => id)
                              .includes(userId) ? (
                            <LeaveNjam userId={userId} njamId={id} />
                          ) : (
                            <JoinNjam userId={userId} njamId={id} />
                          )}
                        </Col>
                      </List.Item>
                    </NavLink>
                  );
                }}
              />
            </Box>
          );
        }
      }}
    </Query>
  );
};

export default Njams;
