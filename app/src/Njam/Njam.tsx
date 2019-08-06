import { Form, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { CompleteNjam, CompleteUser } from '../apollo';
import { Err, FormContainer, Loading } from '../components';
import { NjamFormValues, NjamQuery, routeName, UsersQuery } from '../models';
import { createMoment, mapNjamFormValues } from '../utils';
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

  const [userId, setUserId] = React.useState('');

  React.useEffect(() => {
    const id = localStorage.getItem('userId') || '';

    setUserId(id);
  }, []);

  const save = () => {
    const values = form.getFieldsValue() as NjamFormValues;
    // TODO replace with patch njam api call
    console.log(mapNjamFormValues(userId)(values));
  };

  return (
    <Query<UsersQuery & NjamQuery> query={query} variables={{ id }}>
      {({ data, error, loading }) => {
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
                      <Icon type="edit" onClick={toggleReadOnly} />
                    ) : (
                      <Box>
                        <Icon
                          type="close"
                          onClick={() => {
                            toggleReadOnly();

                            form.resetFields();
                          }}
                          style={{ marginRight: 15 }}
                        />
                        <Icon
                          type="check"
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
      }}
    </Query>
  );
};
export default Form.create({ name: routeName.njams })(Njam);
