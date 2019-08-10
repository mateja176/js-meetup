import { useQuery } from '@apollo/react-hooks';
import { Button, Form, Typography } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { usersQuery, UsersQuery } from './apollo';
import { FormContainer, Loading, Retry, UserSelect } from './components';

export interface SignInProps extends RouteComponentProps {}

const SignIn: React.FC<SignInProps> = ({ history }) => {
  const [userId, setUserId] = React.useState('');

  const usersQueryResult = useQuery<UsersQuery>(usersQuery);

  const { data, loading, error, refetch } = usersQueryResult;

  return (
    <FormContainer mt={3}>
      <Typography.Title>Select user</Typography.Title>
      <Form>
        {(() => {
          if (loading) {
            return <Loading />;
          } else if (error) {
            return <Retry error={error} refetch={refetch} />;
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
        })()}
        <Button
          disabled={!userId}
          onClick={() => {
            localStorage.setItem('userId', userId);
            history.push('/');
          }}
          style={{ marginTop: 15 }}
        >
          Sign in
        </Button>
      </Form>
    </FormContainer>
  );
};
export default SignIn;
