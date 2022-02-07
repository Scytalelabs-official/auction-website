import { NotFoundError } from '@jjmauction/common';
import { Message } from 'node-nats-streaming';

// import {
//   Listener,
//   ListingExpiredEvent,
//   ListingStatus,
//   NotFoundError,
//   Subjects,
// } from '@jjmauction/common';
import { Listener } from '../../../../../common/src/events/base-listener';
import { ListingExpiredEvent } from '../../../../../common/src/events/listing-expired-event';
import { Subjects } from '../../../../../common/src/events/subjects';
import { InventoryStatus } from '../../../../../common/src/events/types/inventory-status';
import { ListingStatus } from '../../../../../common/src/events/types/listing-status';
import { Listing } from '../../models';
import { Inventory } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { queueGroupName } from './queue-group-name';

export class ListingExpiredListener extends Listener<ListingExpiredEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ListingExpired = Subjects.ListingExpired;

  async onMessage(data: ListingExpiredEvent['data'], msg: Message) {
    const { id } = data;
    const listing = await Listing.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundError();
    }

    const newStatus =
      listing.startPrice === listing.currentPrice
        ? ListingStatus.Expired
        : ListingStatus.AwaitingPayment;

    const item = await Inventory.findOne({
      where: { id: listing.inventoryItemId },
    });
    if (!item) {
      throw new NotFoundError();
    }
    if (newStatus === ListingStatus.AwaitingPayment) {
      await item.update({ status: InventoryStatus.Reserved });
    }
    msg.ack();
  }
}
