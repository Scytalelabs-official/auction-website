import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
import cloudinary from 'cloudinary';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import multer from 'multer';

import { ListingCreatedPublisher } from '../events/publishers/listing-created-publisher';
import { Inventory, Listing, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

// import cloudinary , {v2} from 'cloudinary';
// var local_cloudinary = require('cloudinary').v2;

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
// local_cloudinary.config({
//         cloud_name: 'scytalelabs',
//         api_key: '432183885194623',
//         api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
//         secure: true
//     });
const upload = multer({ storage: storage });

router.post(
  '/api/listings',
  upload.single('image'),
  requireAuth,
  [
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('The listing title must be between 5 and 1000 characters'),
    body('expiresAt').custom((value) => {
      let enteredDate = new Date(value);
      let tommorowsDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (enteredDate <= tommorowsDate)
        throw new BadRequestError('Invalid Date');
      return true;
    }),
    body('description')
      .isLength({ min: 5, max: 500 })
      .withMessage(
        'The listing description must be between 5 and 500 characters'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const {
        price,
        title,
        description,
        expiresAt,
        /*********/
        paymentConfirmation,
        massOfItem,
        taxByMassOfItem, //will get this from a table that contains the tax by mass information
        salesTax,
        exciseRate,
        inventoryItemId,
        /*********/
      } = req.body;

      // @ts-ignore
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        eager: [
          { width: 225, height: 225 },
          { width: 1280, height: 1280 },
        ],
      });

      /*************/

      let taxAmount;
      if (salesTax <= 0 || salesTax >= 100) {
        // Need consultancy about higher rate
        throw new BadRequestError('Invalid sales tax rate');

        // throw new BadRequestError('Sales tax ambiguous value given');
      } else {
        taxAmount = (salesTax / 100) * price; //https://propakistani.pk/how-to/how-to-calculate-sales-tax/
      }

      if (
        (taxByMassOfItem <= 0 || taxByMassOfItem >= 100) &&
        (exciseRate <= 0 || exciseRate >= 100)
      ) {
        // throw new BadRequestError('Excise Rate not specified');
        throw new BadRequestError('There must be one tax type specified');
      }
      const item = await Inventory.findOne({
        where: { id: inventoryItemId },
      });

      if (!item) {
        throw new NotFoundError();
      }
      /*************/

      const listing = await Listing.create(
        {
          userId: req.currentUser.id,
          startPrice: price,
          currentPrice: price,
          /******/
          inventoryItemId: item.id,
          paymentConfirmation,
          massOfItem,
          taxByMassOfItem,
          salesTax,
          exciseRate,
          totalPrice:
            price +
            (exciseRate / 100) * price +
            taxAmount +
            (taxByMassOfItem / 100) * massOfItem, //https://www.investopedia.com/terms/e/excisetax.asp
          /******/
          title,
          description,
          expiresAt,
          imageId: result.public_id,
          smallImage: result.eager[0].secure_url,
          largeImage: result.eager[1].secure_url,
        },
        { transaction }
      );

      new ListingCreatedPublisher(natsWrapper.client).publish({
        id: listing.id,
        userId: req.currentUser.id,
        slug: listing.slug,
        title,
        price,
        expiresAt,
        version: listing.version,
      });

      res.status(201).send(listing);
    });
  }
);

export { router as createListingRouter };
