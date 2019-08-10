import React from 'react';
import Err, { ErrProps } from './Err';
import Refetch, { RefetchProps } from './Refetch';

export interface RetryProps extends RefetchProps {
  error: ErrProps;
}

const Retry: React.FC<RetryProps> = ({ error, refetch, children }) => (
  <>
    <Err {...error} />
    <Refetch refetch={refetch}>{children}</Refetch>
  </>
);

export default Retry;
