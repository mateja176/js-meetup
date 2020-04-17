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

const server = new ApolloServer({
  schema,
  context,
  cors: { origin: ['http://localhost:3000', 'https://njam-njam.web.app'] },
  introspection: true,
});

const port = process.env.PORT || 4000;

server.listen(port).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
