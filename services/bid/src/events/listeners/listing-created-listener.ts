// 
import {
  Listener,
  ListingCreatedEvent,
  ListingStatus,
  Subjects,
} from 'scytalelabs-auction';
import { Message } from 'node-nats-streaming';

import { Listing } from '../../models';
import { queueGroupName } from './queue-group-name';

export class ListingCreatedListener extends Listener<ListingCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ListingCreated = Subjects.ListingCreated;

  async onMessage(data: ListingCreatedEvent['data'], msg: Message) {
    const { id, userId, title, slug, expiresAt, price, totalPrice } = data;

    await Listing.create({
      id,
      title,
      slug,
      userId,
      expiresAt,
      startPrice: price,
      currentPrice: price,
      totalPrice: totalPrice,
      status: ListingStatus.Active,
    });

    msg.ack();
  }
}
