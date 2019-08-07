import { Form, Input, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { range } from 'ramda';
import React from 'react';
import { User } from '../../../api/src/models';
import { UserSelect } from '../components';
import { NjamFormValues, Users } from '../models';

const momentFormat = 'HH:mm';

export interface NjamFormProps extends FormComponentProps {
  initialValues: NjamFormValues;
  readOnly?: boolean;
  users: Users;
  hideOrdered?: boolean;
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
  hideOrdered = false,
}) => {
  const [userId, setUserId] = React.useState('');

  React.useEffect(() => {
    const id = localStorage.getItem('userId') || '';

    setUserId(id);
  }, []);

  const singedIn = (id: User['id']) => id !== userId;

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
          initialValue: moment(time),
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
      <Form.Item label="Ordered" style={{ display: hideOrdered ? 'none' : 'initial' }}>
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
      <Form.Item label="Participants">
        {form.getFieldDecorator('participantIds', {
          initialValue: participantIds.filter(singedIn),
          rules: [{ required: true }],
        })(
          <UserSelect
            mode="multiple"
            style={readOnlyStyle}
            users={users.filter(({ id }) => singedIn(id))}
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
