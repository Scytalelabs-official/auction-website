import { Subjects } from './subjects';
import { InventoryStatus } from './types/inventory-status';

export interface InventoryItemUpdatedEvent {
  subject: Subjects.InventoryItemUpdated;
  data: {
    id: string;
    status: InventoryStatus;
    price: number;
    version: number;
  };
}
