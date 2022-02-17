import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { InventoryItemUpdatedPublisher } from '../events/publishers/inventory-item-updated-publisher';
import { Inventory, User, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/inventory/:itemId',
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
      const { title, price, massOfItem, quantity, description } = req.body;
      const itemId = req.params.itemId;

      const item = await Inventory.findOne({
        include: {
          model: User,
        },
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundError();
      }
      item.update(
        {
          title,
          price,
          massOfItem,
          quantity,
          description,
        },
        { transaction }
      );

      // new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
      //   id: item.id!,
      //   // userId: req.currentUser!.id,
      //   // slug: item.slug!,
      //   title,
      //   price,
      //   massOfItem,
      //   description,
      //   createdAt: new Date(Date.now()),
      //   version: item.version!,
      // });

      res.status(201).send(item);
    });
  }
);

export { router as updateItemRouter };
