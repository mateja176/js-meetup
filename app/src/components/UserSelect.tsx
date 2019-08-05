import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import React from 'react';
import { User } from '../../../api/src/models';
import { Users } from '../models';
import UserOption from './UserOption';

export interface UserSelectProps extends SelectProps<User['id']> {
  users: Users;
}

const UserSelect: React.FC<UserSelectProps> = ({ users, ...props }) => (
  <Select {...props}>{users.map(UserOption)}</Select>
);

export default UserSelect;
