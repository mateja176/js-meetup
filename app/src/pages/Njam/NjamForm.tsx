import { Form, Input, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { range } from 'ramda';
import React from 'react';
import { UserSelect } from '../../components';
import { User } from '../../generated/graphql';
import { NjamFormValues, Users } from '../../models';

const momentFormat = 'HH:mm';

export interface NjamFormProps extends FormComponentProps<NjamFormValues> {
  initialValues: NjamFormValues;
  readOnly?: boolean;
  users: Users;
  userId: User['id'];
  hideOrdered?: boolean;
  readOnlyParticipants?: boolean;
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
  userId,
  hideOrdered = false,
  readOnlyParticipants = false,
}) => {
  const readOnlyStyle: React.CSSProperties = {
    pointerEvents: readOnly ? 'none' : 'initial',
  };

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
          initialValue: time,
          rules: [
            {
              required: true,
              type: 'object',
            },
          ],
        })(
          <TimePicker
            inputReadOnly
            style={readOnlyStyle}
            format={momentFormat}
            disabledHours={() => range(0)(23).filter(n => n < moment().hours())}
          />,
        )}
      </Form.Item>
      <Form.Item
        label="Ordered"
        style={{ display: hideOrdered ? 'none' : 'initial' }}
      >
        {form.getFieldDecorator('ordered', {
          initialValue: ordered,
          valuePropName: 'checked',
        })(<Switch style={readOnlyStyle} />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          initialValue: description,
        })(<Input.TextArea readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Participants">
        {form.getFieldDecorator('participantIds', {
          initialValue: participantIds.filter(id => id !== userId),
        })(
          <UserSelect
            style={{
              pointerEvents:
                readOnly || readOnlyParticipants ? 'none' : 'initial',
            }}
            mode="multiple"
            users={users.filter(({ id }) => id !== userId)}
          />,
        )}
      </Form.Item>
      <Form.Item label="Organizer">
        {form.getFieldDecorator('organizerId', {
          initialValue: organizerId,
        })(<UserSelect style={{ pointerEvents: 'none' }} users={users} />)}
      </Form.Item>
    </Form>
  );
};
export default NjamForm;
