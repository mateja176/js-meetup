import { ApolloServer } from 'apollo-server';
import schema from './schema';
const alasql = require('alasql');

const db = new alasql.Database();
db.exec("CREATE TABLE users (id STRING PRIMARY KEY, name STRING, lastname STRING)");
db.exec("CREATE TABLE events (id STRING PRIMARY KEY, name STRING)");
db.exec("CREATE TABLE users_events (id STRING PRIMARY KEY, userId STRING FOREIGN KEY REFERENCES users(id), eventId STRING FOREIGN KEY REFERENCES events(id))");

const server = new ApolloServer({
  schema,
  context: db
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});