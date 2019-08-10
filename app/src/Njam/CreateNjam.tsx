import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { any } from 'ramda';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Redirect, RouteComponentProps } from 'react-router';
import urlJoin from 'url-join';
import {
  createNjamMutation,
  CreateNjamMutation,
  usersQuery,
  UsersQuery,
} from '../apollo';
import { Err, FormContainer, Loading } from '../components';
import { NjamFormValues, routeName, routePath } from '../models';
import { mapNjamFormValues, useUserId } from '../utils';
import NjamForm from './NjamForm';

export interface CreateNjamProps
  extends FormComponentProps<NjamFormValues>,
    RouteComponentProps {}

const CreateNjam: React.FC<CreateNjamProps> = ({ form }) => {
  const userId = useUserId();

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
                hideOrdered
              />
            );
          }
        }}
      </Query>
      <Mutation<CreateNjamMutation> mutation={createNjamMutation}>
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
