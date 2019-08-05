import { Alert, Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import moment from 'moment';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Njam, User } from '../../../api/src/models';
import { CompleteUser } from '../apollo/queries/fragments';
import { Err, FormContainer, Loading } from '../components';
import { NjamFormValues, routeText } from '../models';
import NjamForm from './NjamForm';

const query = gql`
  query {
    users {
      ...CompleteUser
    }
  }
  ${CompleteUser}
`;

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
      id
      location
      description
      time
      participants {
        id
        name
        lastname
      }
      organizer {
        id
        name
        lastname
      }
      ordered
    }
  }
`;

const initialValues: NjamFormValues = {
  location: '',
  ordered: false,
  time: moment(new Date()),
  organizerId: '',
  participantIds: [],
};

export interface CreateNjamProps
  extends FormComponentProps<NjamFormValues>,
    RouteComponentProps {}

const CreateNjam: React.FC<FormComponentProps> = ({ form }) => {
  return (
    <FormContainer>
      <Query<{ users: User[] }> query={query}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Loading />;
          } else if (error) {
            return <Err {...error} />;
          } else {
            const { users } = data!;
            return (
              <NjamForm
                readOnly={false}
                initialValues={initialValues}
                form={form}
                users={users}
              />
            );
          }
        }}
      </Query>
      <Mutation<{ createNjam: Njam }>
        mutation={mutation}
        variables={form.getFieldsValue()}
      >
        {(createNjam, { data, loading, error }) => {
          const createNjamButton = (
            <Button
              onClick={() => {
                createNjam();
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
                <Alert type="error" message="Please retry" />
              </>
            );
          } else {
            return createNjamButton;
          }
        }}
      </Mutation>
    </FormContainer>
  );
};
export default Form.create({ name: routeText.njams })(CreateNjam);
