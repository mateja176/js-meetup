import { v4 as uuid } from 'uuid';
import { Njam } from '../models';

export default {
  Query: {
    njams: async (root, args, context) => await context.njamService.getNjams(args.page, args.pageSize),
    njam: async (root, args, context) => await context.njamService.getNjamById(args.id),
    myNjams: async (root, args, context) => await context.njamService.getMyNjams(args.userId, args.page, args.pageSize),
    njamsCount: async (root, args, context) => await context.njamService.getNjamsCount(),
    myNjamsCount: async (root, args, context) => await context.njamService.getMyNjamsCount(args.userId),
  },
  Mutation: {
    createNjam: async (root, args, context) => {
      let participants: string[] = [];

      if(args.participantIds) {
        participants = [...args.participantIds];
      }

      if (!participants.includes(args.organizerId)) {
        participants.push(args.organizerId);
      }

      const njam = {
        id: uuid(),
        location: args.location,
        description: args.description,
        time: args.time,
        ordered: false,
        organizer: args.organizerId,
        participants: participants
      };

      return await context.njamService.createNjam(njam);
    },
    orderNjam: async (root, args, context) => await context.njamService.orderNjam(args.njamId),
    deleteNjam: async (root, args, context) => await context.njamService.deleteNjam(args.njamId),
    joinNjam: async (root, args, context) => await context.njamService.joinNjam(args.userId, args.njamId),
    leaveNjam: async (root, args, context) => await context.njamService.leaveNjam(args.userId, args.njamId),
    editNjam: async (root, args, context) => {
      const njam = { ...args } as Njam;
      return await context.njamService.editNjam(njam);
    }
  },
  Njam: {
    participants: async (root, args, context) => {
      const participants = await context.userService.getParticipantsForNjam(root.id);
      return participants.map(async participant => context.userService.getUserById(participant.userId));
    },
    organizer: async (root, args, context) => {
      return await context.userService.getUserById(root.organizer);
    }
  }
}
