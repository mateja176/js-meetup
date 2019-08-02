import { v4 as uuid } from 'uuid';
import { Njam, User } from 'models';

export default {
  Query: {
    njams: async (root, args, context, info) => await context.njamService.getNjams(),
    njam: async (root, args, context, info) => await context.njamService.getNjamsById(args.id)
  },
  Mutation: {
    createNjam: (root, args, context, info) => {

    }
  },
  Njam: {
    participants: async (root, args, context, info) => {
      let participants = await context.userService.getParticipantsForNjam(root.id);
      participants = participants.map(async participant => context.userService.getUserById(participant.userId));

      return participants;
    },
    organizer: async (root, args, context, info) => await context.userService.getUserById(root.organizer)
  }
}
