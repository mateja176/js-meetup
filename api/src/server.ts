const alasql = require('alasql');
import { UserService, NjamService } from './services';
import { ApolloServer } from 'apollo-server';
import schema from './schema';
import { Seed } from './seeder';

const db = new alasql.Database();
Seed(db);

const context = {
  'userService': new UserService(db),
  'njamService': new NjamService(db)
}

const server = new ApolloServer({schema, context});

server.listen(4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});