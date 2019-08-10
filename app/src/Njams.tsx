import { Button, Col, List, Row, Switch, Tabs, Typography } from 'antd';
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import { always, equals } from 'ramda';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Box, Flex } from 'rebass';
import urlJoin from 'url-join';
import { Njam } from '../../api/src/models';
import {
  joinNjamMutation,
  JoinNjamResult,
  leaveNjamMutation,
  LeaveNjamResult,
  myNjamsQuery,
  NjamActionParams,
  njamsQuery,
  NjamsQuery,
} from './apollo';
import { Err, MutationResult, StatusCircle } from './components';
import { Njams as INjams } from './models';
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
          // @ts-ignore
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
        // @ts-ignore
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
  <Col
    span={largerSpan}
    style={{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }}
  >
    <Typography.Text>{children}</Typography.Text>
  </Col>
);

const initialFilter = always(true);

type NjamFilter = (njam: Njam) => boolean;

interface FilterType {
  name: string;
  filter: NjamFilter;
}

const oneHourInThePast = moment().subtract(1, 'hour');

const initiallyLoadedAll = false;

const initiallyLoaded: Record<string, NjamsQuery['njams'][0]> = {};

const initialPage = 1;
const pageSize = 10;

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({ match: { path } }) => {
  const [{ filter }, _setFilter] = React.useState<{ filter: NjamFilter }>({
    filter: initialFilter,
  });
  const setFilter = (filter: NjamFilter) => _setFilter({ filter });

  const userId = useUserId();

  const [loadedAll, setLoadedAll] = React.useState(initiallyLoadedAll);

  const [loaded, setLoaded] = React.useState(initiallyLoaded);
  const loadedNjams = Object.values(loaded);

  const [page, setPage] = React.useState(initialPage);

  const [query, _setQuery] = React.useState(njamsQuery);
  const setQuery = (newQuery: Parameters<typeof _setQuery>[0]) => {
    setLoadedAll(initiallyLoadedAll);
    setLoaded(initiallyLoaded);
    setPage(initialPage);
    _setQuery(newQuery);
  };

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
      name: 'myNjams',
      filter: ({ organizer: { id } }) => {
        return id === userId;
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

  return (
    <Query<NjamsQuery>
      query={query}
      pollInterval={1000}
      variables={{ userId, page, pageSize }}
    >
      {({ error, data, loading, refetch }) => {
        const [njams] = Object.values(data!) as INjams[];

        if (equals(njams, [])) {
          setLoadedAll(true);
        }

        const newNjams = (njams || []).filter(
          ({ id }) => !loadedNjams.map(njam => njam.id).includes(id),
        );

        if (newNjams.length) {
          setLoaded(
            newNjams.reduce(
              (loadedNjams, njam) => ({
                ...loadedNjams,
                [njam.id]: njam,
              }),
              loaded,
            ),
          );
        }

        return (
          <Box>
            <Flex>
              <Tabs
                onChange={filterName =>
                  setFilter(
                    filterTypes.find(({ name }) => filterName === name)!.filter,
                  )
                }
              >
                {filterTypes.map(({ name }) => (
                  <Tabs.TabPane
                    key={name}
                    tab={startCase(name)}
                    disabled={loading}
                  />
                ))}
              </Tabs>
              <Box ml={4} mt={10}>
                <Switch
                  loading={loading}
                  checkedChildren="All Njams"
                  unCheckedChildren="My Njams"
                  onChange={() => {
                    setQuery(myNjamsQuery);
                  }}
                />
              </Box>
            </Flex>
            <List
              loading={loading}
              loadMore={
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  m={4}
                  height={32}
                >
                  {loadedAll ? (
                    <Typography.Text>Loaded All</Typography.Text>
                  ) : (
                    <Button
                      loading={loading}
                      onClick={() => {
                        const newPage = page + 1;

                        refetch({ userId, page: newPage, pageSize });

                        setPage(newPage);
                      }}
                    >
                      Load More
                    </Button>
                  )}
                </Flex>
              }
              header={
                <>
                  {error && (
                    <Box mt={2} mb={3}>
                      <Err {...error} />
                    </Box>
                  )}
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
                </>
              }
              bordered
              dataSource={loadedNjams.filter(filter)}
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
                          <Typography.Text style={{ margin: '0 15px' }}>
                            Author
                          </Typography.Text>
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
      }}
    </Query>
  );
};

export default Njams;
