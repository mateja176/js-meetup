import moment from 'moment';
import { Njam, Scalars } from '../../../api/src/models';

export interface NjamFormValues
  extends Omit<Njam, 'time' | 'organizer' | 'participants'> {
  time: moment.Moment;
  organizerId: Scalars['ID'];
  participantIds: Scalars['ID'][];
}
