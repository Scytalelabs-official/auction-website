import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { InventoryItemCreatedPublisher } from '../events/publishers/inventory-item-created-publisher';
import { Inventory, Listing, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/inventory/addItem',
  requireAuth,
  [
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('massOfItem')
      .isFloat({ gt: 0 })
      .withMessage('Mass must be greater than 0'),
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('The item name must be between 5 and 1000 characters'),
    body('description')
      .isLength({ min: 5, max: 500 })
      .withMessage(
        'The inventory description must be between 5 and 500 characters'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const {
        title,
        listingId,
        soldOut,
        price,
        massOfItem,
        quantity,
        description,
      } = req.body;

      const listing = await Listing.findOne({
        where: { id: listingId },
      });

      if (!listing) {
        throw new NotFoundError();
      }
      const item = await Inventory.create(
        {
          listingId,
          soldOut,
          userId: req.currentUser!.id,
          title,
          price,
          massOfItem,
          quantity,
          description,
        },
        { transaction }
      );

      new InventoryItemCreatedPublisher(natsWrapper.client).publish({
        id: item.id!,
        userId: req.currentUser!.id,
        listingId,
        soldOut,
        // slug: item.slug!,
        title,
        price,
        massOfItem,
        description,
        createdAt: new Date(Date.now()),
        version: item.version!,
      });

      res.status(201).send(item);
    });
  }
);

export { router as addItemRouter };
