import { NotFoundError } from '@jjmauction/common';
import { Message } from 'node-nats-streaming';
// import {
//   Listener,
//   ListingCreatedEvent,
//   ListingStatus,
//   Subjects,
// } from '@jjmauction/common';
// import { Listener } from '../../../../../common/src/events/base-listener';
// import { ListingCreatedEvent } from '../../../../../common/src/events/listing-created-event';
// import { Subjects } from '../../../../../common/src/events/subjects';
// import { InventoryStatus } from '../../../../../common/src/events/types/inventory-status';
// import { ListingStatus } from '../../../../../common/src/events/types/listing-status';
import {
  InventoryStatus,
  Listener,
  ListingCreatedEvent,
  ListingStatus,
  Subjects,
} from 'scytalelabs-auction';

import { Listing } from '../../models';
import { Inventory } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { socketIOWrapper } from '../../socket-io-wrapper';
import { InventoryItemUpdatedPublisher } from '../publishers/inventory-item-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class ListingCreatedListener extends Listener<ListingCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ListingCreated = Subjects.ListingCreated;

  async onMessage(data: ListingCreatedEvent['data'], msg: Message) {
    const { id, userId, title, slug, expiresAt, price } = data;

    const listing = await Listing.create({
      id,
      title,
      slug,
      userId,
      expiresAt,
      startPrice: price,
      currentPrice: price,
      status: ListingStatus.Active,
    });

    new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
      id: listing.id,
      status: InventoryStatus.Listed,
      price: listing.currentPrice,
      version: listing.version,
    });

    await socketIOWrapper.io
      .of('/socket')
      .to(listing.id)
      .emit('listing', listing);

    msg.ack();
  }
}
