import { Event } from '../../../common/models';
const uuid = require('uuid/v4');

export default {
  Query: {
    events: (root, args, context, info) => {
      console.log(123);
    },
    event: (root, args, context, info) => {

    }
  },
  Mutation: {
    createEvent: (root, args, context, info) => {

    }
  },
  Event: {
    users: (root, args, context, info) => {

    }
  }
}
