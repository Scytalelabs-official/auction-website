import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from 'scytalelabs-auction';

import { ListingUpdatedPublisher } from '../events/publishers/listing-updated-publisher';
import { DirectBuy, Listing, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/listings/buy/:listingId',
  requireAuth,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),
    body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('Quantity must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const { amount, quantity, user } = req.body;
      const listingId = req.params.listingId;

      const listing = await Listing.findOne({
        where: { id: listingId },
      });

      if (!listing) {
        throw new NotFoundError();
      }

      if (listing.quantity < quantity) {
        throw new BadRequestError(
          'Buying quantity must be less than the listing quantity'
        );
      }
      const direct_buy = await DirectBuy.create(
        {
          listingId,
          userId: req.currentUser.id,
          title: listing.title,
          quantity,
          price: amount,
        },
        { transaction }
      );

      const bought = Number(listing.quantity) - Number(quantity);
      await listing.update({
        quantity: bought,
      });
      new ListingUpdatedPublisher(natsWrapper.client).publish({
        id: listingId,
        status: listing.status,
        currentPrice: listing.totalPrice,
        currentWinnerId: listing.currentWinnerId,
        totalPrice: listing.totalPrice,
        quantity: bought,
        version: listing.version,
      });
      res.status(201).send(listing);
    });
  }
);

export { router as createListingRouter };
