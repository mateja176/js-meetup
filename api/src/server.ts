import alasql from 'alasql';
import { ApolloServer } from 'apollo-server';
import schema from './schema';
import { Seed } from './seeder';
import { NjamService, UserService } from './services';

const db = new (alasql as any).Database();
Seed(db);

const context = {
  userService: new UserService(db),
  njamService: new NjamService(db),
};

const server = new ApolloServer({ schema, context });

server.listen(4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
