import { useMutation } from '@apollo/react-hooks';
import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { any } from 'ramda';
import React from 'react';
import { Query } from 'react-apollo';
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

  const [createNjam, { data, loading, error }] = useMutation<
    CreateNjamMutation
  >(createNjamMutation);

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
      {(() => {
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
      })()}
    </FormContainer>
  );
};
export default Form.create({ name: routeName.createNjam })(CreateNjam);
