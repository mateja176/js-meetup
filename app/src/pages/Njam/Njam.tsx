/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { Err, FormContainer } from '../../components';
import LoadingOverlay from '../../components/LoadingOverlay';
import {
  Maybe,
  Njam as INjam,
  useEditNjamMutation,
  useNjamPageQuery,
} from '../../generated/graphql';
import { NjamFormValues, routeName } from '../../models';
import { formValuesToNjam, njamToFormValues, useUserId } from '../../utils';
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
        const { organizerId, participantIds, ...variables } = formValuesToNjam(
          userId,
        )(values);

        editNjam({ variables: { ...variables, id } });
        toggleReadOnly();
      }
    });
  };

  // alternatively use initial data locally or though a initial global cache
  const { loading, error, data } = useNjamPageQuery({
    pollInterval: 1000,
    variables: { id },
  });

  const [beforeEditSnapshot, setBeforeEditSnapshot] = React.useState<
    Maybe<INjam>
  >(null);

  React.useEffect(() => {
    if (readOnly && data) {
      setBeforeEditSnapshot(data.njam);
    }
  }, [readOnly]);

  // updating initial values does not update ant form field values
  // hence the reset
  // the downside of which is that it can interrupt a user in edit mode
  React.useEffect(() => {
    if (data && data.njam) {
      form.setFieldsValue({
        ...data.njam,
        ...{ ...form.getFieldsValue(), ...beforeEditSnapshot },
      });
    }
  }, [data]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <Box my={3}>
        <Err {...error} />
      </Box>
    );
  }

  const { njam, users } = data!;

  const formValues = njamToFormValues(njam);

  return (
    <FormContainer>
      {editNjamResult.error && (
        <Box my={3}>
          <Err {...editNjamResult.error} />
        </Box>
      )}
      <Flex justifyContent="flex-end">
        {formValues.organizerId === userId && !loading && !error && (
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
        initialValues={formValues}
        users={users}
        userId={userId}
        readOnlyParticipants
      />
    </FormContainer>
  );
};

export default Form.create<NjamProps>({ name: routeName.njams })(Njam);
