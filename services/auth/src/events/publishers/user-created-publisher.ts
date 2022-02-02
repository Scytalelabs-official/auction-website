import { Publisher, Subjects, /*UserCreatedEvent*/ } from '@jjmauction/common';
import {UserCreatedEvent} from '../../../../../common/src/events/user-created-event'

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
