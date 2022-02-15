// import { ListingUpdatedEvent, Publisher, Subjects } from '@jjmauction/common';
import { Publisher } from '../../../../../common/src/events/base-publisher';
// import { PaymentCreatedEvent, Publisher , Subjects } from '@jjmauction/common';
import { InventoryItemUpdatedEvent } from '../../../../../common/src/events/inventory-updated-event';
import { Subjects } from '../../../../../common/src/events/subjects';

export class InventoryItemUpdatedPublisher extends Publisher<InventoryItemUpdatedEvent> {
  subject: Subjects.InventoryItemUpdated = Subjects.InventoryItemUpdated;
}
