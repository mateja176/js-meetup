import { Form, Input, Select, Switch } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
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
  form: { getFieldDecorator },
}) => {
  const [readOnly, setReadOnly] = React.useState(true);

  const required: ValidationRule = readOnly
    ? {}
    : {
        required: true,
        message: 'Field is required',
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

          return (
            <Form
              onSubmit={e => {
                e.preventDefault();
                console.log('submitted');
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
                })(<Switch />)}
              </Form.Item>
              <Form.Item label="Description">
                {getFieldDecorator('description', {
                  initialValue: description,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Invite friends">
                {getFieldDecorator('participants')(<Select />)}
              </Form.Item>
            </Form>
          );
        }
      }}
    </Query>
  );
};
export default Form.create({ name: 'njam' })(Njam);
