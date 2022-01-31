import { Listener, Subjects/*, UserCreatedEvent*/ } from '@jjmauction/common';
import {UserCreatedEvent} from '../../../../../common/src/events/user-created-event';
import { Message } from 'node-nats-streaming';

import { User } from '../../models';
import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.UserCreated = Subjects.UserCreated;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, name, avatar, email,isRegister, version } = data;

    await User.create({ id, name, avatar, email, isRegister, version });

    msg.ack();
  }
}
