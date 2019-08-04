import { Col, List, Row, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { css } from 'emotion';
import { capitalize } from 'lodash';
import React from 'react';
import { Query } from 'react-apollo';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import urlJoin from 'url-join';
import { Njam } from '../../api/src/models';
import { Err, Loading, StatusCircle } from './components';

const keys = ['location', 'time', 'organizer', 'ordered'] as const;
const columns = keys.map(capitalize);

const njamsQuery = gql`
  query {
    njams {
      id
      location
      time
      organizer {
        name
      }
      ordered
    }
  }
`;

const Column: React.FC = ({ children }) => (
  <Col span={6}>
    <Typography.Text>{children}</Typography.Text>
  </Col>
);

export interface NjamsProps extends RouteComponentProps {}

const Njams: React.FC<NjamsProps> = ({ match: { path } }) => (
  <Query<{ njams: Njam[] }> query={njamsQuery}>
    {({ error, data, loading }) => {
      if (loading) {
        return <Loading />;
      }

      if (error) {
        return <Err {...error} />;
      }

      if (data) {
        const { njams } = data;

        return (
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
            dataSource={njams}
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
        );
      }
    }}
  </Query>
);

export default Njams;
