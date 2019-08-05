import { Form, Input, Select, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React from 'react';
import { Njam, User } from '../../../api/src/models';

export interface NjamFormProps extends FormComponentProps {
  initialValues: Njam;
  readOnly: boolean;
  onSubmit: () => void;
  users: User[];
}

const NjamForm: React.FC<NjamFormProps> = ({
  readOnly,
  onSubmit,
  form,
  initialValues: {
    location,
    time,
    description,
    organizer,
    participants,
    ordered,
  },
  users,
}) => {
  const required = !readOnly;

  const readOnlyStyle: React.CSSProperties = {
    pointerEvents: readOnly ? 'none' : 'initial',
  };

  const usersOptions = users.map(({ id, name, lastname }) => (
    <Select.Option key={id} value={id}>
      {name} {lastname}
    </Select.Option>
  ));

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();

        onSubmit();
      }}
    >
      <Form.Item label="Location">
        {form.getFieldDecorator('location', {
          initialValue: location,
          rules: [{ required }],
        })(<Input readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Time">
        {form.getFieldDecorator('time', {
          initialValue: moment(time),
          rules: [
            {
              required,
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
        })(<Input readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Invite friends">
        {form.getFieldDecorator('participants', {
          initialValue: participants.map(({ id }) => id),
        })(
          <Select mode="multiple" style={readOnlyStyle}>
            {usersOptions}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Organizer">
        {form.getFieldDecorator('organizer', {
          initialValue: organizer.id,
        })(<Select style={readOnlyStyle}>{usersOptions}</Select>)}
      </Form.Item>
    </Form>
  );
};
export default NjamForm;