// import { ListingDeletedEvent, Publisher, Subjects } from '@jjmauction/common';
import { Publisher } from '../../../../../common/src/events/base-publisher';
import { InventoryItemDeletedEvent } from '../../../../../common/src/events/inventory-deleted-event';
import { Subjects } from '../../../../../common/src/events/subjects';
export class InventoryItemDeletedPublisher extends Publisher<InventoryItemDeletedEvent> {
  subject: Subjects.InventoryItemDeleted = Subjects.InventoryItemDeleted;
}
