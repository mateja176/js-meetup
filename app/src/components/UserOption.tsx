import { Select } from 'antd';
import React from 'react';
import { User } from '../generated/graphql';

const UserOption: React.FC<User> = ({ id, name, lastname }) => (
  <Select.Option key={id} value={id}>
    {name} {lastname}
  </Select.Option>
);

export default UserOption;
