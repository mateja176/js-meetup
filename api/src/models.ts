export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Event = {
  __typename?: "Event";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type Mutation = {
  __typename?: "Mutation";
  createUser?: Maybe<User>;
};

export type MutationCreateUserArgs = {
  name: Scalars["String"];
  lastname: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  users?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  events?: Maybe<Array<Maybe<Event>>>;
  event?: Maybe<Event>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryEventArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
};
