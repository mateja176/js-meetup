import * as path from 'path';
import { makeExecutableSchema } from 'apollo-server';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')));
// @ts-ignore
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;