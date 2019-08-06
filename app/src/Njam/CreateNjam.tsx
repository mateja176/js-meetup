import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import moment from 'moment';
import { any } from 'ramda';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Redirect, RouteComponentProps } from 'react-router';
import urlJoin from 'url-join';
import { Njam } from '../../../api/src/models';
import { CompleteNjam, usersQuery } from '../apollo';
import { Err, FormContainer, Loading } from '../components';
import { NjamFormValues, routeName, routePath, UsersQuery } from '../models';
import { mapNjamFormValues } from '../utils';
import NjamForm from './NjamForm';

const mutation = gql`
  mutation(
    $location: String!
    $description: String
    $time: String!
    $organizerId: ID!
  ) {
    createNjam(
      location: $location
      description: $description
      time: $time
      organizerId: $organizerId
    ) {
      ...CompleteNjam
    }
  }
  ${CompleteNjam}
`;

export interface CreateNjamProps
  extends FormComponentProps<NjamFormValues>,
    RouteComponentProps {}

const CreateNjam: React.FC<FormComponentProps> = ({ form }) => {
  const [userId, setUserId] = React.useState('');

  React.useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
    }
  }, []);

  const disabled =
    !form.isFieldsTouched() ||
    any(Boolean)(Object.values(form.getFieldsError()));

  return (
    <FormContainer>
      <Query<UsersQuery> query={usersQuery}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Loading />;
          } else if (error) {
            return <Err {...error} />;
          } else {
            const { users } = data!;
            return (
              <NjamForm
                initialValues={{
                  location: '',
                  ordered: false,
                  time: moment().add(1, 'hour'),
                  organizerId: userId,
                  participantIds: [],
                  description: '',
                }}
                form={form}
                users={users}
              />
            );
          }
        }}
      </Query>
      <Mutation<{ createNjam: Njam }> mutation={mutation}>
        {(createNjam, { data, loading, error }) => {
          const createNjamButton = (
            <Button
              disabled={disabled}
              onClick={() => {
                form.validateFieldsAndScroll((error, values) => {
                  if (!error) {
                    const variables = mapNjamFormValues(userId)(values);

                    createNjam({ variables });
                  }
                });
              }}
            >
              Create Njam
            </Button>
          );

          if (loading) {
            return <Button loading />;
          } else if (error) {
            return (
              <>
                {createNjamButton}
                <br />
                <br />
                <Err {...error} />
              </>
            );
          }
          if (data) {
            const {
              createNjam: { id },
            } = data;

            return <Redirect to={urlJoin(routePath.njams, id)} />;
          } else {
            return createNjamButton;
          }
        }}
      </Mutation>
    </FormContainer>
  );
};
export default Form.create({ name: routeName.createNjam })(CreateNjam);
