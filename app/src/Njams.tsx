import { Col, List, Row, Tabs, Typography } from 'antd';
import { css } from 'emotion';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import { always } from 'ramda';
import React from 'react';
import { Query } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Box } from 'rebass';
import urlJoin from 'url-join';
import { Njam } from '../../api/src/models';
import { njamsQuery } from './apollo';
import { Err, Loading, StatusCircle } from './components';

const keys = ['location', 'time', 'organizer', 'ordered'] as const;
const columns = keys.map(capitalize);

const Column: React.FC = ({ children }) => (
  <Col span={6}>
    <Typography.Text>{children}</Typography.Text>
  </Col>
);

const initialFilter = always(true);

type NjamFilter = (njam: Njam) => boolean;

interface FilterType {
  name: string;
  filter: NjamFilter;
}

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({ match: { path } }) => {
  const [{ filter }, _setFilter] = React.useState<{ filter: NjamFilter }>({
    filter: initialFilter,
  });
  const setFilter = (filter: NjamFilter) => _setFilter({ filter });

  const oneHourFromNow = moment().add(1, 'hour');

  const filterTypes: FilterType[] = [
    { name: 'all', filter: initialFilter },
    {
      name: 'upcoming',
      filter: ({ time }) => moment(time).isAfter(oneHourFromNow),
    },
    {
      name: 'inProgress',
      filter: ({ time }) => {
        const momentTime = moment(time);

        return momentTime.isBetween(momentTime, momentTime.add(1, 'hour'));
      },
    },
    {
      name: 'past',
      filter: ({ time }) => {
        const momentTime = moment(time);

        return momentTime.isBefore(oneHourFromNow);
      },
    },
  ];

  return (
    <Query<{ njams: Njam[] }>
      query={njamsQuery}
      // fetchPolicy="cache-and-network"
    >
      {({ error, data, loading }) => {
        if (loading) {
          return <Loading />;
        } else if (error) {
          return <Err {...error} />;
        } else {
          const { njams } = data!;

          return (
            <Box>
              <Tabs>
                {filterTypes.map(({ name, filter }) => (
                  <Tabs.TabPane
                    key={name}
                    tab={
                      <Box onClick={() => setFilter(filter)}>
                        {startCase(name)}
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              <List
                header={
                  <Row>
                    {columns.map(key => {
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
                dataSource={njams.filter(filter)}
                renderItem={({ id, location, time, ordered, organizer }) => {
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
                        <Column>
                          {ordered ? (
                            <StatusCircle color="lightgreen">Yes</StatusCircle>
                          ) : (
                            <StatusCircle color="lightcoral">No</StatusCircle>
                          )}
                        </Column>
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
