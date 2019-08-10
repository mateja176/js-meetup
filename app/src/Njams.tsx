import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Col, List, Row, Switch, Tabs, Typography } from 'antd';
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import qs from 'query-string';
import { always, equals } from 'ramda';
import React from 'react';
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
  const [leaveNjam, mutationResult] = useMutation<LeaveNjamResult>(
    leaveNjamMutation,
  );

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
    <MutationResult {...mutationResult} Data={() => <JoinNjam {...props} />}>
      {base}
    </MutationResult>
  );
};

const JoinNjam: React.FC<NjamActionParams> = props => {
  const [joinNjam, mutationResult] = useMutation<JoinNjamResult>(
    joinNjamMutation,
  );

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
    <MutationResult {...mutationResult} Data={() => <LeaveNjam {...props} />}>
      {base}
    </MutationResult>
  );
};

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

type FilterValue = (njam: Njam) => boolean;

interface Filter {
  name: string;
  value: FilterValue;
}

const oneHourInThePast = moment().subtract(1, 'hour');

const initiallyLoadedAll = false;

const initiallyLoaded: Record<string, NjamsQuery['njams'][0]> = {};

const initialPage = 1;
const pageSize = 10;

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({
  match: { path },
  location: { search },
  history,
}) => {
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

  const filterNames = [
    'all',
    'upcoming',
    'inProgress',
    'myNjams',
    'past',
  ] as const;

  type FilterName = typeof filterNames[number];

  const filterName = filterNames.reduce(
    (_filterName, name) => ({ ..._filterName, [name]: name }),
    {} as { [name in FilterName]: name },
  );

  const filters: Filter[] = [
    { name: filterName.all, value: always(true) },
    {
      name: filterName.upcoming,
      value: ({ time }) => createMoment(time).isAfter(moment()),
    },
    {
      name: filterName.inProgress,
      value: ({ time }) => {
        const momentTime = createMoment(time);

        return momentTime.isBetween(oneHourInThePast, moment());
      },
    },
    {
      name: filterName.myNjams,
      value: ({ organizer: { id } }) => {
        return id === userId;
      },
    },
    {
      name: filterName.past,
      value: ({ time }) => {
        const momentTime = createMoment(time);

        return momentTime.isBefore(oneHourInThePast);
      },
    },
  ];

  const filterQuery = qs.parse(search).filter as FilterName;

  const activeFilter = filterNames.includes(filterQuery) ? filterQuery : 'all';

  const { error, data, loading, refetch } = useQuery<NjamsQuery>(query, {
    pollInterval: 1000,
    variables: { userId, page, pageSize },
  });

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
          activeKey={activeFilter}
          onChange={filterName => {
            history.push({
              search: qs.stringify({ filter: filterName }),
            });
          }}
        >
          {filters.map(({ name }) => (
            <Tabs.TabPane key={name} tab={startCase(name)} disabled={loading} />
          ))}
        </Tabs>
        <Box ml={4} mt={10}>
          <Switch
            loading={loading}
            checkedChildren="All Njams"
            unCheckedChildren="My Njams"
            onChange={on => {
              setQuery(on ? myNjamsQuery : njamsQuery);
            }}
          />
        </Box>
      </Flex>
      <List
        loading={loading}
        loadMore={
          <Flex justifyContent="center" alignItems="center" m={4} height={32}>
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
                  <Col span={i === 3 ? smallerSpan : largerSpan} key={key}>
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
        dataSource={loadedNjams.filter(
          filters.find(({ name }) => name === activeFilter)!.value,
        )}
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
                  ) : participants.map(({ id }) => id).includes(userId) ? (
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
};

export default Njams;
