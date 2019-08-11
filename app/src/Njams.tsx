import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  List,
  Popover,
  Row,
  Switch,
  Tabs,
  Typography,
} from 'antd';
import { gql } from 'apollo-boost';
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import qs from 'query-string';
import { always } from 'ramda';
import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Box, Flex } from 'rebass';
import urlJoin from 'url-join';
import {
  MutationJoinNjamArgs,
  Njam,
  QueryMyNjamsArgs,
  QueryNjamsArgs,
} from '../../api/src/models';
import {
  joinNjamMutation,
  JoinNjamResult,
  leaveNjamMutation,
  LeaveNjamResult,
  MyNjamsQuery,
  NjamsQuery,
  NjamSummaries,
  NjamSummary,
} from './apollo';
import { Err, StatusCircle } from './components';
import { createMoment, useUserId } from './utils';

const njamsAndCount = gql`
  query($page: Int, $pageSize: Int) {
    njams(page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
    njamsCount
  }
  ${NjamSummary}
`;

interface NjamsAndCount extends NjamsQuery {
  njamsCount: number;
}

const myNjamsAndCount = gql`
  query($userId: ID!, $page: Int, $pageSize: Int) {
    myNjams(userId: $userId, page: $page, pageSize: $pageSize) {
      ...NjamSummary
    }
    myNjamsCount(userId: $userId)
  }
  ${NjamSummary}
`;

interface MyNjamsAndCount extends MyNjamsQuery {
  myNjamsCount: number;
}

const createNjamAction = ({
  mutation,
  getInverse,
  text,
}: {
  mutation: Parameters<typeof useMutation>[0];
  getInverse: () => React.ComponentType<MutationJoinNjamArgs>;
  text: string;
}): React.FC<MutationJoinNjamArgs> => variables => {
  const [mutationFunction, { loading, error, data }] = useMutation<
    JoinNjamResult & LeaveNjamResult,
    MutationJoinNjamArgs
  >(mutation, { variables });

  const { name, message } = error || new Error('');

  const dataLoaded = Object.values(data || {}).length;

  const Inverse = getInverse();

  return dataLoaded ? (
    <Inverse {...variables} />
  ) : (
    <Popover visible={!!error} title={name} content={message}>
      <Button
        loading={loading}
        onClick={e => {
          e.preventDefault();

          mutationFunction();
        }}
      >
        {text}
      </Button>
    </Popover>
  );
};

const LeaveNjam = createNjamAction({
  mutation: leaveNjamMutation,
  text: 'Leave',
  getInverse: () => JoinNjam,
});

const JoinNjam = createNjamAction({
  mutation: joinNjamMutation,
  text: 'Join',
  getInverse: () => LeaveNjam,
});

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

const initiallyLoaded: Record<string, NjamsQuery['njams'][0]> = {};

const initialPage = 1;
const pageSize = 10;

const initialQuery = njamsAndCount;

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({
  match: { path },
  location: { search },
  history,
}) => {
  const userId = useUserId();

  const [loaded, setLoaded] = React.useState(initiallyLoaded);
  const loadedNjams = Object.values(loaded);

  const [page, setPage] = React.useState(initialPage);

  const [query, _setQuery] = React.useState(initialQuery);
  const setQuery = (newQuery: Parameters<typeof _setQuery>[0]) => {
    setLoaded(initiallyLoaded);
    setPage(initialPage);
    _setQuery(newQuery);
  };

  const filterNames = [
    'all',
    'upcoming',
    'inProgress',
    'byYou',
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
      name: filterName.byYou,
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

  const { error, data, loading, refetch } = useQuery<
    NjamsAndCount & MyNjamsAndCount,
    QueryNjamsArgs & QueryMyNjamsArgs
  >(query, {
    pollInterval: 1000,
    variables: { userId, page, pageSize },
  });

  const [njams = [], count = 0] = Object.values(data!) as [
    NjamSummaries,
    number
  ];

  React.useEffect(() => {
    const newNjams = njams.filter(({ id }) => {
      const loadedNjamsIds = loadedNjams.map(njam => njam.id);

      return !loadedNjamsIds.includes(id);
    });

    if (newNjams.length) {
      const newlyLoaded = newNjams.reduce(
        (_loaded, njam) => ({
          ..._loaded,
          [njam.id]: njam,
        }),
        loaded,
      );

      setLoaded(newlyLoaded);
    }
  }, [njams]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadedAll = loadedNjams.length === count;

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
            unCheckedChildren="Going to"
            onChange={on => {
              setQuery(on ? myNjamsAndCount : initialQuery);
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
          const isParticipating = participants
            .map(({ id }) => id)
            .includes(userId);

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
                  ) : isParticipating ? (
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
