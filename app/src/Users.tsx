import { Col, List, Row, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { User } from 'common/models';
import * as React from 'react';
import { Query } from 'react-apollo';

const usersQuery = gql`
  {
    users {
      id
      name
      lastname
    }
  }
`;

export interface UsersProps {}

const Users: React.FC<UsersProps> = () => (
  <Query<{ users: User[] }> query={usersQuery}>
    {({ loading, error, data }) => {
      if (loading) {
        return 'Loading';
      } else if (data) {
        const { users } = data;

        return (
          <List
            header={
              <div>
                <Row>
                  <Col span={12}>
                    <Typography.Title level={2}>First name</Typography.Title>
                  </Col>
                  <Col span={12}>
                    <Typography.Title level={2}>Last name</Typography.Title>
                  </Col>
                </Row>
              </div>
            }
            bordered
            dataSource={users}
            renderItem={({ name, lastname }) => (
              <List.Item>
                <Col span={12}>
                  <Typography.Text>{name}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text>{lastname}</Typography.Text>
                </Col>
              </List.Item>
            )}
          />
        );
      } else {
        return JSON.stringify(error);
      }
    }}
  </Query>
);

export default Users;
