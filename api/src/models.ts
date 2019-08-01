export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: "Mutation";
  createUser?: Maybe<User>;
  createNjam?: Maybe<Njam>;
};

export type MutationCreateUserArgs = {
  name: Scalars["String"];
  lastname: Scalars["String"];
};

export type MutationCreateNjamArgs = {
  location: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  time: Scalars["String"];
};

export type Njam = {
  __typename?: "Njam";
  id: Scalars["ID"];
  location: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  time: Scalars["String"];
  participants: Array<User>;
  organizer: User;
  ordered: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  users?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  njams?: Maybe<Array<Maybe<Njam>>>;
  njam?: Maybe<Njam>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryNjamArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
};
