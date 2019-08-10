import { Button, Form, Typography } from 'antd';
import React from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { usersQuery, UsersQuery } from './apollo';
import { Err, FormContainer, Loading, UserSelect } from './components';

export interface SignInProps extends RouteComponentProps {}

const SignIn: React.FC<SignInProps> = ({ history }) => {
  const [userId, setUserId] = React.useState('');

  return (
    <FormContainer mt={3}>
      <Typography.Title>Select user</Typography.Title>
      <Form>
        <Query<UsersQuery> query={usersQuery}>
          {({ data, error, loading }) => {
            if (loading) {
              return <Loading />;
            } else if (error) {
              return <Err {...error} />;
            } else {
              const { users } = data!;

              return (
                <UserSelect
                  users={users}
                  onChange={id => {
                    setUserId(id);
                  }}
                />
              );
            }
          }}
        </Query>
        <br />
        <br />
        <Button
          disabled={!userId}
          onClick={() => {
            localStorage.setItem('userId', userId);
            history.push('/');
          }}
        >
          Sign in
        </Button>
      </Form>
    </FormContainer>
  );
};
export default SignIn;
