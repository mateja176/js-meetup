import { v4 as uuid } from 'uuid';

export default {
  Query: {
    njams: async (root, args, context, info) => await context.njamService.getNjams(),
    njam: async (root, args, context, info) => await context.njamService.getNjamById(args.id),
    myNjams: async (root, args, context, info) => await context.njamService.getMyNjams(args.userId)
  },
  Mutation: {
    createNjam: async (root, args, context, info) => {
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
    orderNjam: async (root, args, context, info) => await context.njamService.orderNjam(args.njamId),
    deleteNjam: async (root, args, context, info) => await context.njamService.deleteNjam(args.njamId),
    joinNjam: async (root, args, context, info) => await context.njamService.joinNjam(args.userId, args.njamId),
    leaveNjam: async (root, args, context, info) => await context.njamService.leaveNjam(args.userId, args.njamId),
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
