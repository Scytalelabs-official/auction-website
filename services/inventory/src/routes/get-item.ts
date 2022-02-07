import { NotFoundError } from '@jjmauction/common';
import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize';

import { Inventory, User } from '../models';

const router = express.Router();

router.get('/api/inventory/:itemSlug', async (req: Request, res: Response) => {
  const itemSlug = req.params.itemSlug;

  const item = await Inventory.findOne({
    include: {
      model: User,
    },
    where: { slug: itemSlug },
  });

  if (!item) {
    throw new NotFoundError();
  }

  res.status(200).send(item);
});

export { router as getItemRouter };
