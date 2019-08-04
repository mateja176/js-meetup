import { useQuery } from '@apollo/react-hooks';
import { Form, Input, Select, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { gql } from 'apollo-boost';
import React from 'react';
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
  extends NjamModel,
    Pick<RouteComponentProps<{ id: string }>, 'match'>,
    FormComponentProps {}

const Njam: React.FC<NjamProps> = ({
  match: {
    params: { id },
  },
  form: { getFieldDecorator },
}) => {
  const { data, error } = useQuery(query, {
    variables: { id },
    fetchPolicy: 'cache-first',
  });

  if (data) {
    const { njam } = data;

    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          console.log('submitted');
        }}
      >
        <Form.Item label="Location">
          {getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: 'Please input a location',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Time">
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: 'Please select a time',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Ordered">
          {getFieldDecorator('ordered', {
            rules: [{ type: 'boolean' }],
          })(<Switch />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description')(<Input />)}
        </Form.Item>
        <Form.Item label="Invite friends">
          {getFieldDecorator('participants')(<Select />)}
        </Form.Item>
      </Form>
    );
  } else if (error) {
    return <Err {...error} />;
  } else {
    return <Loading />;
  }
};
export default Form.create({ name: 'njam' })(Njam);
