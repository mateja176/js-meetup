import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { Err, FormContainer } from '../../components';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useEditNjamMutation, useNjamPageQuery } from '../../generated/graphql';
import { NjamFormValues, routeName } from '../../models';
import { createMoment, mapNjamFormValues, useUserId } from '../../utils';
import NjamForm from './NjamForm';

interface NjamProps
  extends RouteComponentProps<{ id: string }>,
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

  const [editNjam, editNjamResult] = useEditNjamMutation();

  const save = () => {
    form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const variables = mapNjamFormValues(userId)(values);

        editNjam({ variables: { ...variables, id } });
        toggleReadOnly();
      }
    });
  };

  const { data, error, loading } = useNjamPageQuery({
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
      {editNjamResult.error && (
        <Box my={3}>
          <Err {...editNjamResult.error} />
        </Box>
      )}
      <Flex justifyContent="flex-end">
        {organizer.id === userId && !loading && !error && (
          <Box mr={4}>
            {readOnly ? (
              <Button
                icon="edit"
                onClick={toggleReadOnly}
                loading={editNjamResult.loading}
              />
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
                <Button icon="check" onClick={save} />
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

export default Form.create<NjamProps>({ name: routeName.njams })(Njam);
