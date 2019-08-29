import { Button } from 'antd';
import { isEmpty } from 'ramda';
import React from 'react';
import { MutationResult as ApolloMutationResult } from 'react-apollo';
import Err from './Err';

export interface MutationResultProps<D>
  extends Pick<ApolloMutationResult<D>, 'loading' | 'error' | 'data'> {
  children: React.ReactNode;
  Data: React.ComponentType<D>;
}

const MutationResult = <D extends {}>({
  loading,
  error,
  data,
  children,
  Data,
}: MutationResultProps<D>) => {
  if (loading) {
    return <Button loading />;
  }
  if (error) {
    return (
      <>
        {children}
        <Err {...error} />
      </>
    );
  }
  if (!isEmpty(data)) {
    return <Data {...data!} />;
  }
  return children;
};

export default MutationResult;
