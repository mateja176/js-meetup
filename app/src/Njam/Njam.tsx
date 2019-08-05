import { Form, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import moment from 'moment';
import React from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { Njam as NjamModel, User } from '../../../api/src/models';
import { Err, Loading } from '../components';
import { routeText } from '../models';
import NjamForm from './NjamForm';

const query = gql`
  query($id: ID!) {
    njam(id: $id) {
      id
      location
      time
      ordered
      organizer {
        id
        name
        lastname
      }
      description
      participants {
        id
        name
        lastname
      }
    }
    users {
      id
      name
      lastname
    }
  }
`;

interface NjamProps
  extends Pick<RouteComponentProps<{ id: string }>, 'match'>,
    FormComponentProps {}

const Njam: React.FC<NjamProps> = ({
  match: {
    params: { id },
  },
  form,
}) => {
  const [readOnly, setReadOnly] = React.useState(true);
  const toggleReadOnly = () => setReadOnly(!readOnly);

  const save = () => {
    const { time, ...values } = form.getFieldsValue();
    console.log({ ...values, time: time.utc().toString() });
  };

  return (
    <Query<{ njam: NjamModel; users: User[] }> query={query} variables={{ id }}>
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
            <Box mx={4}>
              <Flex justifyContent="flex-end">
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
              </Flex>
              <NjamForm
                readOnly={readOnly}
                form={form}
                initialValues={{
                  ...njam,
                  time: moment(time),
                  organizerId: organizer.id,
                  participantIds: participants.map(({ id }) => id),
                }}
                onSubmit={save}
                users={users}
              />
            </Box>
          );
        }
      }}
    </Query>
  );
};
export default Form.create({ name: routeText.njams })(Njam);
