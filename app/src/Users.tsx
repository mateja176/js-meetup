import { useQuery } from '@apollo/react-hooks';
import { Col, List, Row, Typography } from 'antd';
import React from 'react';
import { usersQuery, UsersQuery } from './apollo';
import { Err } from './components';

export interface UsersProps {}

const Users: React.FC<UsersProps> = () => {
  const { data, loading, error } = useQuery<UsersQuery>(usersQuery, {
    pollInterval: 1000,
  });

  const { users = [] } = data!;

  return (
    <>
      {error && <Err {...error} />}
      <List
        loading={loading}
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
    </>
  );
};
export default Users;
