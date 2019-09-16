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
  createUser: User;
  createNjam: Njam;
  orderNjam: Njam;
  deleteNjam: Njam;
  joinNjam: Njam;
  leaveNjam: Njam;
  editNjam: Njam;
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
  users: Array<User>;
  user: User;
  njams: Array<Njam>;
  njam: Njam;
  myNjams: Array<Njam>;
  njamsCount: Scalars["Int"];
  myNjamsCount: Scalars["Int"];
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
