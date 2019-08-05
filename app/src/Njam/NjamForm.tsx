import { Form, Input, Select, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React from 'react';
import { User } from '../../../api/src/models';
import { NjamFormValues } from '../models';

export interface NjamFormProps extends FormComponentProps {
  initialValues: NjamFormValues;
  readOnly: boolean;
  users: User[];
}

const NjamForm: React.FC<NjamFormProps> = ({
  readOnly,
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
          initialValue: participantIds,
        })(
          <Select mode="multiple" style={readOnlyStyle}>
            {usersOptions}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Organizer">
        {form.getFieldDecorator('organizer', {
          initialValue: organizerId,
        })(<Select style={readOnlyStyle}>{usersOptions}</Select>)}
      </Form.Item>
    </Form>
  );
};
export default NjamForm;
