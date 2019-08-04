import { Form, Icon, Input as AntInput, Select, Switch } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { InputProps } from 'antd/lib/input';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Box, Flex } from 'rebass';
import { Njam as NjamModel } from '../../api/src/models';
import { Err, Loading } from './components';

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
  }
`;

interface NjamProps
  extends Pick<RouteComponentProps<{ id: string }>, 'match'>,
    FormComponentProps {}

const Njam: React.FC<NjamProps> = ({
  match: {
    params: { id },
  },
  form: { getFieldDecorator, resetFields },
}) => {
  const [readOnly, setReadOnly] = React.useState(true);
  const toggleReadOnly = () => setReadOnly(!readOnly);

  const required: ValidationRule = readOnly
    ? {}
    : {
        required: true,
        message: 'Field is required',
      };

  const readOnlyStyle: React.CSSProperties = {
    pointerEvents: readOnly ? 'none' : 'initial',
  };

  const save = () => {
    console.log('submitted');
  };

  return (
    <Query<{ njam: NjamModel }> query={query} variables={{ id }}>
      {({ data, error, loading }) => {
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return <Err {...error} />;
        } else {
          const { njam } = data!;

          const { location, time, ordered, description, participants } = njam;

          const Input: React.FC<Omit<InputProps, 'readOnly'>> = props => (
            <AntInput {...props} readOnly={readOnly} />
          );

          return (
            <Box>
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

                          resetFields();
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
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  save();
                }}
              >
                <Form.Item label="Location">
                  {getFieldDecorator('location', {
                    initialValue: location,
                    rules: [required],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Time">
                  {getFieldDecorator('time', {
                    initialValue: time,
                    rules: [required],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Ordered">
                  {getFieldDecorator('ordered', {
                    initialValue: ordered,
                    rules: [{ type: 'boolean' }],
                  })(<Switch style={{ ...readOnlyStyle }} />)}
                </Form.Item>
                <Form.Item label="Description">
                  {getFieldDecorator('description', {
                    initialValue: description,
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Invite friends">
                  {getFieldDecorator('participants')(
                    <Select mode="multiple" style={{ ...readOnlyStyle }} />,
                  )}
                </Form.Item>
              </Form>
            </Box>
          );
        }
      }}
    </Query>
  );
};
export default Form.create({ name: 'njam' })(Njam);
