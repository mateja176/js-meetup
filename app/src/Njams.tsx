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
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import qs from 'query-string';
import { always } from 'ramda';
import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Box, Flex } from 'rebass';
import urlJoin from 'url-join';
import { Err } from './components';
import {
  JoinNjamDocument,
  JoinNjamMutationResult,
  JoinNjamMutationVariables,
  LeaveNjamDocument,
  LeaveNjamMutationResult,
  MyNjamsCountDocument,
  MyNjamsCountQueryResult,
  MyNjamsCountQueryVariables,
  MyNjamsDocument,
  MyNjamsQueryVariables,
  Njam,
  NjamsCountDocument,
  NjamsCountQueryResult,
  NjamsDocument,
  NjamsQueryVariables,
  NjamSummaryFragment,
  useToggleOrderedMutation,
} from './generated/graphql';
import { createMoment, useUserId } from './utils';

const createNjamAction = ({
  mutation,
  getInverse,
  text,
}: {
  mutation: Parameters<typeof useMutation>[0];
  getInverse: () => React.ComponentType<JoinNjamMutationVariables>;
  text: string;
}): React.FC<JoinNjamMutationVariables> => variables => {
  const [mutationFunction, { loading, error, data }] = useMutation<
    JoinNjamMutationResult & LeaveNjamMutationResult,
    JoinNjamMutationVariables
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
  mutation: LeaveNjamDocument,
  text: 'Leave',
  getInverse: () => JoinNjam,
});

const JoinNjam = createNjamAction({
  mutation: JoinNjamDocument,
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

const initialPage = 1;
const pageSize = 10;

enum CollectionQueryKey {
  njams = 'njams',
  myNjams = 'myNjams',
}
type CollectionQueryResult = {
  [key in CollectionQueryKey]: NjamSummaryFragment[];
};

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({
  match: { path },
  location: { search },
  history,
}) => {
  const userId = useUserId();

  const [queries, setQueries] = React.useState<{
    njams: typeof NjamsDocument;
    count: typeof NjamsCountDocument;
  }>({
    njams: NjamsDocument,
    count: NjamsCountDocument,
  });

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

  const {
    error,
    data,
    loading,
    fetchMore,
    // refetch,
  } = useQuery<
    CollectionQueryResult,
    NjamsQueryVariables & MyNjamsQueryVariables
  >(queries.njams, {
    // pollInterval: 1000,
    variables: { userId, page: initialPage, pageSize },
  });
  const [njams = []] = Object.values(data!) as [NjamSummaryFragment[]];

  const countResult = useQuery<
    NjamsCountQueryResult | MyNjamsCountQueryResult,
    MyNjamsCountQueryVariables
  >(queries.count, { variables: { userId }, pollInterval: 1000 });
  const [count = 0] = Object.values(countResult.data!);

  const [toggleOrdered, toggleOrderedResults] = useToggleOrderedMutation();
  const toggleOrderedError = toggleOrderedResults.error || new Error('');

  const loadedAll = njams.length >= count;

  const page = Math.ceil(njams.length / pageSize);

  const isONNewPage = njams.length % pageSize === 0;

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
              setQueries(
                on
                  ? { njams: MyNjamsDocument, count: MyNjamsCountDocument }
                  : { njams: NjamsDocument, count: NjamsCountDocument },
              );
            }}
          />
        </Box>
        {/* <Box ml={4} mt={1}>
          <Button
            icon="reload"
            onClick={() => {
              refetch({ userId, page });
            }}
          />
        </Box> */}
        {/* <Box>
          <Button
            onClick={() => {
              refetch({ userId, pageSize: 100 });
            }}
          >
            Load 100
          </Button>
        </Box> */}
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
                  fetchMore({
                    variables: {
                      page: isONNewPage ? page + 1 : page,
                    },
                    updateQuery: (oldResults, { fetchMoreResult }) => {
                      const [[njamsKey, oldNjams]] = Object.entries(
                        oldResults,
                      ) as [[CollectionQueryKey, NjamSummaryFragment[]]];

                      const [newNjams] = Object.values(fetchMoreResult!);

                      const existingIds = oldNjams.map(({ id }) => id);

                      const filteredNjams = newNjams.filter(
                        ({ id }) => !existingIds.includes(id),
                      );
                      const updatedResult = {
                        [njamsKey]: oldNjams.concat(filteredNjams),
                      } as CollectionQueryResult;
                      return updatedResult;
                    },
                  });
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
            {countResult.error && (
              <Box mt={2} mb={3}>
                <Err {...countResult.error} />
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
        dataSource={njams
          .filter(filters.find(({ name }) => name === activeFilter)!.value)
          .filter(
            njams.length > count &&
              queries.njams.definitions[0].name.value ===
                CollectionQueryKey.myNjams
              ? ({ participants }) =>
                  participants.map(({ id }) => id).includes(userId)
              : always(true),
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
                  <Popover
                    visible={!!toggleOrderedResults.error}
                    title={toggleOrderedError.name}
                    content={toggleOrderedError.message}
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      disabled={userId !== organizer.id}
                      loading={toggleOrderedResults.loading}
                      defaultChecked={ordered}
                      onChange={(_, e) => {
                        e.preventDefault();

                        toggleOrdered({ variables: { id, ordered: !ordered } });
                      }}
                    />
                  </Popover>
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
