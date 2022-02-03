import { Publisher } from '../../../../../common/src/events/base-publisher';
// import { PaymentCreatedEvent, Publisher , Subjects } from '@jjmauction/common';
import { InventoryItemCreatedEvent } from '../../../../../common/src/events/inventory-created-event';
import { Subjects } from '../../../../../common/src/events/subjects';

export class InventoryItemCreatedPublisher extends Publisher<InventoryItemCreatedEvent> {
  subject: Subjects.InventoryItemCreated = Subjects.InventoryItemCreated;
}
