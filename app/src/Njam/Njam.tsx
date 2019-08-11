import { useQuery } from '@apollo/react-hooks';
import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { Scalars } from '../../../api/src/models';
import { CompleteNjam, CompleteUser, NjamQuery, UsersQuery } from '../apollo';
import { Err, FormContainer } from '../components';
import LoadingOverlay from '../components/LoadingOverlay';
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

  const { data, error, loading } = useQuery<
    NjamQuery & UsersQuery,
    { id: Scalars['ID'] }
  >(query, {
    pollInterval: 1000,
    variables: { id },
  });

  const {
    // ? default value is not type checked
    njam: { time, organizer, participants, ...njam } = {
      time: '0',
      organizer: { id: '' },
      participants: [],
      id: '',
      location: '',
      description: '',
      ordered: false,
    },
    users = [],
  } = data!;

  return (
    <FormContainer>
      {loading && <LoadingOverlay />}
      {error && (
        <Box my={3}>
          <Err {...error} />
        </Box>
      )}
      <Flex justifyContent="flex-end">
        {organizer.id === userId && !loading && !error && (
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
        userId={userId}
        readOnlyParticipants
      />
    </FormContainer>
  );
};

export default Form.create({ name: routeName.njams })(Njam);
