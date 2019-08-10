import { useQuery } from '@apollo/react-hooks';
import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { CompleteNjam, CompleteUser, NjamQuery, UsersQuery } from '../apollo';
import { Err, FormContainer, Loading } from '../components';
import { NjamFormValues, routeName } from '../models';
import { createMoment, mapNjamFormValues, useUserId } from '../utils';
import NjamForm from './NjamForm';

const query = gql`
  query($id: ID!) {
    njam(id: $id) {
      ...CompleteNjam
    }
    users {
      ...CompleteUser
    }
  }
  ${CompleteUser}
  ${CompleteNjam}
`;

interface NjamProps
  extends Pick<RouteComponentProps<{ id: string }>, 'match'>,
    FormComponentProps<NjamFormValues> {}

const Njam: React.FC<NjamProps> = ({
  match: {
    params: { id },
  },
  form,
}) => {
  const [readOnly, setReadOnly] = React.useState(true);
  const toggleReadOnly = () => setReadOnly(!readOnly);

  const userId = useUserId();

  const save = () => {
    const values = form.getFieldsValue() as NjamFormValues;
    // TODO replace with set njam api call
    console.log(mapNjamFormValues(userId)(values));
  };

  const { data, error, loading } = useQuery<NjamQuery & UsersQuery>(query, {
    pollInterval: 1000,
    variables: { id },
  });

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Err {...error} />;
  } else {
    const {
      njam: { time, organizer, participants, ...njam },
      users,
    } = data!;

    return (
      <FormContainer>
        <Flex justifyContent="flex-end">
          {organizer.id === userId && (
            <Box mr={4}>
              {readOnly ? (
                <Button icon="edit" onClick={toggleReadOnly} />
              ) : (
                <Box>
                  <Button
                    icon="close"
                    onClick={() => {
                      toggleReadOnly();

                      form.resetFields();
                    }}
                    style={{ marginRight: 10 }}
                  />
                  <Button
                    icon="check"
                    onClick={() => {
                      toggleReadOnly();

                      save();
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Flex>
        <NjamForm
          readOnly={readOnly}
          form={form}
          initialValues={{
            ...njam,
            time: createMoment(time),
            organizerId: organizer.id,
            participantIds: participants.map(({ id }) => id),
          }}
          users={users}
        />
      </FormContainer>
    );
  }
};

export default Form.create({ name: routeName.njams })(Njam);
