import { Subjects } from './subjects';

export interface InventoryItemCreatedEvent {
  subject: Subjects.InventoryItemCreated;
  data: {
    id: string;
    userId: string;
    // listingId: string;
    // soldOut: number;
    // slug: string;
    title: string;
    fixPrice:number;
    totalPrice: number;
    quantity: number;
    massOfItem: number;
    description: string;
    createdAt: Date;
    version: number;
  };
}
