import { Alert, Col, List, Row, Spin, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { User } from 'common/models';
import React from 'react';
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
    {({ error, data }) => {
      if (data) {
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
      } else if (error) {
        const { message, name } = error;

        return <Alert message={name} description={message} type="error" />;
      } else {
        return <Spin size="large" />;
      }
    }}
  </Query>
);

export default Users;
