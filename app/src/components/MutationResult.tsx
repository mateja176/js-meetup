import { Button } from 'antd';
import React from 'react';
import { MutationResult as ApolloMutationResult } from 'react-apollo';
import Err from './Err';

export interface MutationResultProps<D>
  extends Pick<ApolloMutationResult<D>, 'loading' | 'error' | 'data'> {
  children: React.ComponentType<D>;
}

const MutationResult = <D extends {}>({
  loading,
  error,
  data,
  children: Data,
}: MutationResultProps<D>) => {
  if (loading) {
    return <Button loading />;
  } else if (error) {
    return <Err {...error} />;
  } else {
    return <Data {...data!} />;
  }
};

export default MutationResult;
