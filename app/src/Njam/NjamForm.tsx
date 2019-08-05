import { Form, Input, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React from 'react';
import { UserSelect } from '../components';
import { NjamFormValues, Users } from '../models';

export interface NjamFormProps extends FormComponentProps {
  initialValues: NjamFormValues;
  readOnly?: boolean;
  users: Users;
}

const NjamForm: React.FC<NjamFormProps> = ({
  readOnly = false,
  form,
  initialValues: {
    location,
    time,
    description,
    organizerId,
    participantIds,
    ordered,
  },
  users,
}) => {
  const readOnlyStyle: React.CSSProperties = {
    pointerEvents: readOnly ? 'none' : 'initial',
  };

  const { name = '', lastname = '' } = users.find(
    ({ id }) => id === organizerId,
  )!;

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
      }}
      hideRequiredMark={readOnly}
    >
      <Form.Item label="Location">
        {form.getFieldDecorator('location', {
          initialValue: location,
          rules: [{ required: true }],
        })(<Input readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Time">
        {form.getFieldDecorator('time', {
          initialValue: moment(time),
          rules: [
            {
              required: true,
              type: 'object',
            },
          ],
        })(<TimePicker inputReadOnly style={readOnlyStyle} format="hh:mm" />)}
      </Form.Item>
      <Form.Item label="Ordered">
        {form.getFieldDecorator('ordered', {
          initialValue: ordered,
          rules: [{ type: 'boolean' }],
        })(<Switch style={readOnlyStyle} />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          initialValue: description,
        })(<Input.TextArea readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Invite friends">
        {form.getFieldDecorator('participantIds', {
          initialValue: participantIds,
          rules: [{ required: true }],
        })(<UserSelect mode="multiple" style={readOnlyStyle} users={users} />)}
      </Form.Item>
      <Form.Item label="Organizer">
        {form.getFieldDecorator('organizerId', {
          initialValue: `${name} ${lastname}`,
        })(<Input readOnly />)}
      </Form.Item>
    </Form>
  );
};
export default NjamForm;
