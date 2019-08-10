import { QueryResult } from '@apollo/react-common';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React from 'react';

export interface RefetchProps extends ButtonProps {
  refetch: QueryResult['refetch'];
}

const Refetch: React.FC<RefetchProps> = ({ children, refetch }) => (
  <Button onClick={() => refetch()}>{children}</Button>
);

export default Refetch;
