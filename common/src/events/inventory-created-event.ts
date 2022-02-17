import { Subjects } from './subjects';

export interface InventoryItemCreatedEvent {
  subject: Subjects.InventoryItemCreated;
  data: {
    id: string;
    userId: string;
    // slug: string;
    title: string;
    price: number;
    massOfItem: number;
    description: string;
    createdAt: Date;
    version: number;
  };
}
