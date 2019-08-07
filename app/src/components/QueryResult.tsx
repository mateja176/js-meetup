import React from 'react';
import { QueryResult as ApolloQueryResult } from 'react-apollo';
import Err from './Err';
import Loading from './Loading';

export interface QueryResultProps<D>
  extends Pick<ApolloQueryResult<D>, 'loading' | 'error' | 'data'> {
  children: React.ComponentType<D>;
}

const QueryResult = <D extends {}>({
  loading,
  error,
  data,
  children: Data,
}: QueryResultProps<D>) => {
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Err {...error} />;
  } else {
    return <Data {...data!} />;
  }
};

export default QueryResult;
