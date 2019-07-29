import { Event } from '../models';
const uuid = require('uuid/v4');

export default {
  Query: {
    events: (root, args, context, info) => {
      // const events = context.getCollection('events');
      // return events.find();
    },
    event: (root, args, context, info) => {
      // const events = context.getCollection('events');
      // const event = events.find({ 'id': args.id })
      // return event;
    }
  },
  Mutation: {
    createEvent: (root, args, context, info) => {
      // const events = context.getCollection('events');
      // const event: Event = {
      //   id: uuid(),
      //   name: args.name
      // };
      // events.insert(event);
      // return event;
    }
  },
  Event: {
    users: (root, args, context, info) => []
  }
}
