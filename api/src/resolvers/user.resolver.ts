import { User } from '../../../common/models';
import { v4 as uuid } from 'uuid';

export default {
  Query: {
    users: async (root, args, context, info) => {
      const users = await context.exec("SELECT * FROM users");
      return users;
    },
    user: async (root, args, context, info) => {
      const user = await context.exec(`SELECT * FROM users WHERE id='${args.id}'`);
      return user;
    }
  },
  Mutation: {
    createUser: async (root, args, context, info) => {
      const user: User = {
        id: uuid(),
        name: args.name,
        lastname: args.lastname
      };

      await context.exec(`INSERT INTO users (id, name, lastname) VALUES ('${user.id}', '${user.name}', '${user.lastname}')`);
      return user;
    }
  }
}
