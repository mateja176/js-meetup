import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Mutation = {
  __typename?: 'Mutation',
  createUser: User,
  createNjam: Njam,
  orderNjam: Njam,
  deleteNjam: Njam,
  joinNjam: Njam,
  leaveNjam: Njam,
  editNjam: Njam,
};


export type MutationCreateUserArgs = {
  name: Scalars['String'],
  lastname: Scalars['String']
};


export type MutationCreateNjamArgs = {
  location: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  time: Scalars['String'],
  organizerId: Scalars['ID'],
  participantIds?: Maybe<Array<Scalars['ID']>>
};


export type MutationOrderNjamArgs = {
  njamId: Scalars['ID']
};


export type MutationDeleteNjamArgs = {
  njamId: Scalars['ID']
};


export type MutationJoinNjamArgs = {
  userId: Scalars['ID'],
  njamId: Scalars['ID']
};


export type MutationLeaveNjamArgs = {
  userId: Scalars['ID'],
  njamId: Scalars['ID']
};


export type MutationEditNjamArgs = {
  id: Scalars['ID'],
  location?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  time?: Maybe<Scalars['String']>,
  ordered?: Maybe<Scalars['Boolean']>
};

export type Njam = {
  __typename?: 'Njam',
  id: Scalars['ID'],
  location: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  time: Scalars['String'],
  participants: Array<User>,
  organizer: User,
  ordered: Scalars['Boolean'],
};

export type Query = {
  __typename?: 'Query',
  users: Array<User>,
  user: User,
  njams: Array<Njam>,
  njam: Njam,
  myNjams: Array<Njam>,
  njamsCount: Scalars['Int'],
  myNjamsCount: Scalars['Int'],
};


export type QueryUserArgs = {
  id: Scalars['ID']
};


export type QueryNjamsArgs = {
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type QueryNjamArgs = {
  id: Scalars['ID']
};


export type QueryMyNjamsArgs = {
  userId: Scalars['ID'],
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type QueryMyNjamsCountArgs = {
  userId: Scalars['ID']
};

export type User = {
  __typename?: 'User',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  lastname?: Maybe<Scalars['String']>,
};
export type CompleteUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'lastname'>
);

export type NjamBaseFragment = (
  { __typename?: 'Njam' }
  & Pick<Njam, 'id' | 'location' | 'time' | 'ordered'>
);

export type NjamSummaryFragment = (
  { __typename?: 'Njam' }
  & { organizer: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
  ), participants: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
)
  & NjamBaseFragment
;

export type CompleteNjamFragment = (
  { __typename?: 'Njam' }
  & Pick<Njam, 'description'>
  & { organizer: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'lastname'>
  ), participants: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'lastname'>
  )> }
)
  & NjamBaseFragment
;

export type CreateNjamMutationVariables = {
  location: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  time: Scalars['String'],
  organizerId: Scalars['ID'],
  participantIds?: Maybe<Array<Scalars['ID']>>
};


export type CreateNjamMutation = (
  { __typename?: 'Mutation' }
  & { createNjam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type LeaveNjamMutationVariables = {
  userId: Scalars['ID'],
  njamId: Scalars['ID']
};


export type LeaveNjamMutation = (
  { __typename?: 'Mutation' }
  & { leaveNjam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type JoinNjamMutationVariables = {
  userId: Scalars['ID'],
  njamId: Scalars['ID']
};


export type JoinNjamMutation = (
  { __typename?: 'Mutation' }
  & { joinNjam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type ToggleOrderedMutationVariables = {
  id: Scalars['ID'],
  ordered?: Maybe<Scalars['Boolean']>
};


export type ToggleOrderedMutation = (
  { __typename?: 'Mutation' }
  & { editNjam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type EditNjamMutationVariables = {
  id: Scalars['ID'],
  location?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  time?: Maybe<Scalars['String']>,
  ordered?: Maybe<Scalars['Boolean']>
};


export type EditNjamMutation = (
  { __typename?: 'Mutation' }
  & { editNjam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<{ __typename?: 'User' }
    & CompleteUserFragment
  > }
);

export type UserIdsQueryVariables = {};


export type UserIdsQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type NjamsQueryVariables = {
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type NjamsQuery = (
  { __typename?: 'Query' }
  & { njams: Array<{ __typename?: 'Njam' }
    & NjamSummaryFragment
  > }
);

export type MyNjamsQueryVariables = {
  userId: Scalars['ID'],
  page?: Maybe<Scalars['Int']>,
  pageSize?: Maybe<Scalars['Int']>
};


export type MyNjamsQuery = (
  { __typename?: 'Query' }
  & { myNjams: Array<{ __typename?: 'Njam' }
    & NjamSummaryFragment
  > }
);

export type NjamQueryVariables = {
  id: Scalars['ID']
};


export type NjamQuery = (
  { __typename?: 'Query' }
  & { njam: { __typename?: 'Njam' }
    & CompleteNjamFragment
   }
);

export type NjamsCountQueryVariables = {};


export type NjamsCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'njamsCount'>
);

export type MyNjamsCountQueryVariables = {
  userId: Scalars['ID']
};


export type MyNjamsCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'myNjamsCount'>
);

export type NjamPageQueryVariables = {
  id: Scalars['ID']
};


export type NjamPageQuery = (
  { __typename?: 'Query' }
  & { njam: { __typename?: 'Njam' }
    & CompleteNjamFragment
  , users: Array<{ __typename?: 'User' }
    & CompleteUserFragment
  > }
);
export const CompleteUserFragmentDoc = gql`
    fragment CompleteUser on User {
  id
  name
  lastname
}
    `;
export const NjamBaseFragmentDoc = gql`
    fragment NjamBase on Njam {
  id
  location
  time
  ordered
}
    `;
export const NjamSummaryFragmentDoc = gql`
    fragment NjamSummary on Njam {
  ...NjamBase
  organizer {
    id
    name
  }
  participants {
    id
  }
}
    ${NjamBaseFragmentDoc}`;
export const CompleteNjamFragmentDoc = gql`
    fragment CompleteNjam on Njam {
  ...NjamBase
  description
  organizer {
    id
    name
    lastname
  }
  participants {
    id
    name
    lastname
  }
}
    ${NjamBaseFragmentDoc}`;
export const CreateNjamDocument = gql`
    mutation createNjam($location: String!, $description: String, $time: String!, $organizerId: ID!, $participantIds: [ID!]) {
  createNjam(location: $location, description: $description, time: $time, organizerId: $organizerId, participantIds: $participantIds) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;
export type CreateNjamMutationFn = ApolloReactCommon.MutationFunction<CreateNjamMutation, CreateNjamMutationVariables>;

    export function useCreateNjamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNjamMutation, CreateNjamMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateNjamMutation, CreateNjamMutationVariables>(CreateNjamDocument, baseOptions);
    };
export type CreateNjamMutationHookResult = ReturnType<typeof useCreateNjamMutation>;
export type CreateNjamMutationResult = ApolloReactCommon.MutationResult<CreateNjamMutation>;
export type CreateNjamMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateNjamMutation, CreateNjamMutationVariables>;
export const LeaveNjamDocument = gql`
    mutation leaveNjam($userId: ID!, $njamId: ID!) {
  leaveNjam(userId: $userId, njamId: $njamId) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;
export type LeaveNjamMutationFn = ApolloReactCommon.MutationFunction<LeaveNjamMutation, LeaveNjamMutationVariables>;

    export function useLeaveNjamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LeaveNjamMutation, LeaveNjamMutationVariables>) {
      return ApolloReactHooks.useMutation<LeaveNjamMutation, LeaveNjamMutationVariables>(LeaveNjamDocument, baseOptions);
    };
export type LeaveNjamMutationHookResult = ReturnType<typeof useLeaveNjamMutation>;
export type LeaveNjamMutationResult = ApolloReactCommon.MutationResult<LeaveNjamMutation>;
export type LeaveNjamMutationOptions = ApolloReactCommon.BaseMutationOptions<LeaveNjamMutation, LeaveNjamMutationVariables>;
export const JoinNjamDocument = gql`
    mutation joinNjam($userId: ID!, $njamId: ID!) {
  joinNjam(userId: $userId, njamId: $njamId) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;
export type JoinNjamMutationFn = ApolloReactCommon.MutationFunction<JoinNjamMutation, JoinNjamMutationVariables>;

    export function useJoinNjamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinNjamMutation, JoinNjamMutationVariables>) {
      return ApolloReactHooks.useMutation<JoinNjamMutation, JoinNjamMutationVariables>(JoinNjamDocument, baseOptions);
    };
export type JoinNjamMutationHookResult = ReturnType<typeof useJoinNjamMutation>;
export type JoinNjamMutationResult = ApolloReactCommon.MutationResult<JoinNjamMutation>;
export type JoinNjamMutationOptions = ApolloReactCommon.BaseMutationOptions<JoinNjamMutation, JoinNjamMutationVariables>;
export const ToggleOrderedDocument = gql`
    mutation toggleOrdered($id: ID!, $ordered: Boolean) {
  editNjam(id: $id, ordered: $ordered) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;
export type ToggleOrderedMutationFn = ApolloReactCommon.MutationFunction<ToggleOrderedMutation, ToggleOrderedMutationVariables>;

    export function useToggleOrderedMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleOrderedMutation, ToggleOrderedMutationVariables>) {
      return ApolloReactHooks.useMutation<ToggleOrderedMutation, ToggleOrderedMutationVariables>(ToggleOrderedDocument, baseOptions);
    };
export type ToggleOrderedMutationHookResult = ReturnType<typeof useToggleOrderedMutation>;
export type ToggleOrderedMutationResult = ApolloReactCommon.MutationResult<ToggleOrderedMutation>;
export type ToggleOrderedMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleOrderedMutation, ToggleOrderedMutationVariables>;
export const EditNjamDocument = gql`
    mutation editNjam($id: ID!, $location: String, $description: String, $time: String, $ordered: Boolean) {
  editNjam(id: $id, location: $location, description: $description, time: $time, ordered: $ordered) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;
export type EditNjamMutationFn = ApolloReactCommon.MutationFunction<EditNjamMutation, EditNjamMutationVariables>;

    export function useEditNjamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditNjamMutation, EditNjamMutationVariables>) {
      return ApolloReactHooks.useMutation<EditNjamMutation, EditNjamMutationVariables>(EditNjamDocument, baseOptions);
    };
export type EditNjamMutationHookResult = ReturnType<typeof useEditNjamMutation>;
export type EditNjamMutationResult = ApolloReactCommon.MutationResult<EditNjamMutation>;
export type EditNjamMutationOptions = ApolloReactCommon.BaseMutationOptions<EditNjamMutation, EditNjamMutationVariables>;
export const UsersDocument = gql`
    query users {
  users {
    ...CompleteUser
  }
}
    ${CompleteUserFragmentDoc}`;

    export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
      return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
    };
      export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      };
      
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserIdsDocument = gql`
    query userIds {
  users {
    id
  }
}
    `;

    export function useUserIdsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserIdsQuery, UserIdsQueryVariables>) {
      return ApolloReactHooks.useQuery<UserIdsQuery, UserIdsQueryVariables>(UserIdsDocument, baseOptions);
    };
      export function useUserIdsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserIdsQuery, UserIdsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UserIdsQuery, UserIdsQueryVariables>(UserIdsDocument, baseOptions);
      };
      
export type UserIdsQueryHookResult = ReturnType<typeof useUserIdsQuery>;
export type UserIdsQueryResult = ApolloReactCommon.QueryResult<UserIdsQuery, UserIdsQueryVariables>;
export const NjamsDocument = gql`
    query njams($page: Int, $pageSize: Int) {
  njams(page: $page, pageSize: $pageSize) {
    ...NjamSummary
  }
}
    ${NjamSummaryFragmentDoc}`;

    export function useNjamsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NjamsQuery, NjamsQueryVariables>) {
      return ApolloReactHooks.useQuery<NjamsQuery, NjamsQueryVariables>(NjamsDocument, baseOptions);
    };
      export function useNjamsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NjamsQuery, NjamsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<NjamsQuery, NjamsQueryVariables>(NjamsDocument, baseOptions);
      };
      
export type NjamsQueryHookResult = ReturnType<typeof useNjamsQuery>;
export type NjamsQueryResult = ApolloReactCommon.QueryResult<NjamsQuery, NjamsQueryVariables>;
export const MyNjamsDocument = gql`
    query myNjams($userId: ID!, $page: Int, $pageSize: Int) {
  myNjams(userId: $userId, page: $page, pageSize: $pageSize) {
    ...NjamSummary
  }
}
    ${NjamSummaryFragmentDoc}`;

    export function useMyNjamsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyNjamsQuery, MyNjamsQueryVariables>) {
      return ApolloReactHooks.useQuery<MyNjamsQuery, MyNjamsQueryVariables>(MyNjamsDocument, baseOptions);
    };
      export function useMyNjamsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyNjamsQuery, MyNjamsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MyNjamsQuery, MyNjamsQueryVariables>(MyNjamsDocument, baseOptions);
      };
      
export type MyNjamsQueryHookResult = ReturnType<typeof useMyNjamsQuery>;
export type MyNjamsQueryResult = ApolloReactCommon.QueryResult<MyNjamsQuery, MyNjamsQueryVariables>;
export const NjamDocument = gql`
    query njam($id: ID!) {
  njam(id: $id) {
    ...CompleteNjam
  }
}
    ${CompleteNjamFragmentDoc}`;

    export function useNjamQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NjamQuery, NjamQueryVariables>) {
      return ApolloReactHooks.useQuery<NjamQuery, NjamQueryVariables>(NjamDocument, baseOptions);
    };
      export function useNjamLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NjamQuery, NjamQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<NjamQuery, NjamQueryVariables>(NjamDocument, baseOptions);
      };
      
export type NjamQueryHookResult = ReturnType<typeof useNjamQuery>;
export type NjamQueryResult = ApolloReactCommon.QueryResult<NjamQuery, NjamQueryVariables>;
export const NjamsCountDocument = gql`
    query njamsCount {
  njamsCount
}
    `;

    export function useNjamsCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NjamsCountQuery, NjamsCountQueryVariables>) {
      return ApolloReactHooks.useQuery<NjamsCountQuery, NjamsCountQueryVariables>(NjamsCountDocument, baseOptions);
    };
      export function useNjamsCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NjamsCountQuery, NjamsCountQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<NjamsCountQuery, NjamsCountQueryVariables>(NjamsCountDocument, baseOptions);
      };
      
export type NjamsCountQueryHookResult = ReturnType<typeof useNjamsCountQuery>;
export type NjamsCountQueryResult = ApolloReactCommon.QueryResult<NjamsCountQuery, NjamsCountQueryVariables>;
export const MyNjamsCountDocument = gql`
    query myNjamsCount($userId: ID!) {
  myNjamsCount(userId: $userId)
}
    `;

    export function useMyNjamsCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyNjamsCountQuery, MyNjamsCountQueryVariables>) {
      return ApolloReactHooks.useQuery<MyNjamsCountQuery, MyNjamsCountQueryVariables>(MyNjamsCountDocument, baseOptions);
    };
      export function useMyNjamsCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyNjamsCountQuery, MyNjamsCountQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MyNjamsCountQuery, MyNjamsCountQueryVariables>(MyNjamsCountDocument, baseOptions);
      };
      
export type MyNjamsCountQueryHookResult = ReturnType<typeof useMyNjamsCountQuery>;
export type MyNjamsCountQueryResult = ApolloReactCommon.QueryResult<MyNjamsCountQuery, MyNjamsCountQueryVariables>;
export const NjamPageDocument = gql`
    query njamPage($id: ID!) {
  njam(id: $id) {
    ...CompleteNjam
  }
  users {
    ...CompleteUser
  }
}
    ${CompleteNjamFragmentDoc}
${CompleteUserFragmentDoc}`;

    export function useNjamPageQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NjamPageQuery, NjamPageQueryVariables>) {
      return ApolloReactHooks.useQuery<NjamPageQuery, NjamPageQueryVariables>(NjamPageDocument, baseOptions);
    };
      export function useNjamPageLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NjamPageQuery, NjamPageQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<NjamPageQuery, NjamPageQueryVariables>(NjamPageDocument, baseOptions);
      };
      
export type NjamPageQueryHookResult = ReturnType<typeof useNjamPageQuery>;
export type NjamPageQueryResult = ApolloReactCommon.QueryResult<NjamPageQuery, NjamPageQueryVariables>;