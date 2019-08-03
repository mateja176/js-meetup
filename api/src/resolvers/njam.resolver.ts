import { v4 as uuid } from 'uuid';

export default {
  Query: {
    njams: async (root, args, context, info) => await context.njamService.getNjams(),
    njam: async (root, args, context, info) => await context.njamService.getNjamById(args.id)
  },
  Mutation: {
    createNjam: async (root, args, context, info) => {
      if (!args.organizerId) {
        throw new Error('Missing parameter: organizerId');
      }

      const njam = {
        id: uuid(),
        location: args.location,
        description: args.description,
        time: args.time,
        ordered: false,
        organizer: args.organizerId,
        participants: [args.organizerId]
      };

      return await context.njamService.createNjam(njam);
    },
    orderNjam: async (root, args, context, info) => await context.njamService.orderNjam(args.njamId)
  },
  Njam: {
    participants: async (root, args, context, info) => {
      const participants = await context.userService.getParticipantsForNjam(root.id);
      return participants.map(async participant => context.userService.getUserById(participant.userId));
    },
    organizer: async (root, args, context, info) => {
      return await context.userService.getUserById(root.organizer);
    }
  }
}
