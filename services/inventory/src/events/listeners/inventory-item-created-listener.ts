import { Message } from 'node-nats-streaming';

import { Listener } from '../../../../../common/src/events/base-listener';
// import { Listener, ListingCreatedEvent, Subjects } from '@jjmauction/common';
import { InventoryItemCreatedEvent } from '../../../../../common/src/events/inventory-created-event';
import { Subjects } from '../../../../../common/src/events/subjects';
import { Inventory } from '../../models';
import { queueGroupName } from './queue-group-name';

export class InventoryCreatedListener extends Listener<InventoryItemCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.InventoryItemCreated = Subjects.InventoryItemCreated;

  async onMessage(data: InventoryItemCreatedEvent['data'], msg: Message) {
    const { id, title, price, massOfItem, description } = data;

    await Inventory.create({
      id,
      title,
      price,
      massOfItem,
      description,
    });

    msg.ack();
  }
}
