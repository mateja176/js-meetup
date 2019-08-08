import { Button } from 'antd';
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
  } else if (error) {
    return (
      <>
        {children}
        <Err {...error} />
      </>
    );
  } else if (data) {
    return <Data {...data} />;
  } else {
    return children;
  }
};

export default MutationResult;
