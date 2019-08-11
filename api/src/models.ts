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
  orderNjam?: Maybe<Njam>;
  deleteNjam?: Maybe<Njam>;
  joinNjam?: Maybe<Njam>;
  leaveNjam?: Maybe<Njam>;
  editNjam?: Maybe<Njam>;
};

export type MutationCreateUserArgs = {
  name: Scalars["String"];
  lastname: Scalars["String"];
};

export type MutationCreateNjamArgs = {
  location: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  time: Scalars["String"];
  organizerId: Scalars["ID"];
  participantIds?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationOrderNjamArgs = {
  njamId: Scalars["ID"];
};

export type MutationDeleteNjamArgs = {
  njamId: Scalars["ID"];
};

export type MutationJoinNjamArgs = {
  userId: Scalars["ID"];
  njamId: Scalars["ID"];
};

export type MutationLeaveNjamArgs = {
  userId: Scalars["ID"];
  njamId: Scalars["ID"];
};

export type MutationEditNjamArgs = {
  id: Scalars["ID"];
  location?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  time?: Maybe<Scalars["String"]>;
  ordered?: Maybe<Scalars["Boolean"]>;
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
  myNjams?: Maybe<Array<Maybe<Njam>>>;
  njamsCount?: Maybe<Scalars["Int"]>;
  myNjamsCount?: Maybe<Scalars["Int"]>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryNjamsArgs = {
  page?: Maybe<Scalars["Int"]>;
  pageSize?: Maybe<Scalars["Int"]>;
};

export type QueryNjamArgs = {
  id: Scalars["ID"];
};

export type QueryMyNjamsArgs = {
  userId: Scalars["ID"];
  page?: Maybe<Scalars["Int"]>;
  pageSize?: Maybe<Scalars["Int"]>;
};

export type QueryMyNjamsCountArgs = {
  userId: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
};
