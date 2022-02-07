import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
// import cloudinary from 'cloudinary';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { InventoryItemCreatedPublisher } from '../events/publishers/inventory-item-created-publisher';
import { Inventory, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

// import multer from 'multer';

// import cloudinary , {v2} from 'cloudinary';
// var local_cloudinary = require('cloudinary').v2;

const router = express.Router();

// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   },
// });
// local_cloudinary.config({
//         cloud_name: 'scytalelabs',
//         api_key: '432183885194623',
//         api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
//         secure: true
//     });
// const upload = multer({ storage: storage });

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
    // body('expiresAt').custom((value) => {
    //   let enteredDate = new Date(value);
    //   let tommorowsDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    //   if (enteredDate <= tommorowsDate)
    //     throw new BadRequestError('Invalid Date');
    //   return true;
    // }),
    body('description')
      .isLength({ min: 5, max: 500 })
      .withMessage(
        'The inventory description must be between 5 and 500 characters'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const { title, price, massOfItem, description } = req.body;

      // // @ts-ignore
      // const result = await cloudinary.v2.uploader.upload(req.file.path, {
      //   eager: [
      //     { width: 225, height: 225 },
      //     { width: 1280, height: 1280 },
      //   ],
      // });

      const item = await Inventory.create(
        {
          userId: req.currentUser!.id,
          title,
          price,
          massOfItem,
          description,
        },
        { transaction }
      );

      new InventoryItemCreatedPublisher(natsWrapper.client).publish({
        id: item.id!,
        userId: req.currentUser!.id,
        slug: item.slug!,
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
