import { requireAuth } from '@jjmauction/common';
import express, { Request, Response } from 'express';

import { Inventory } from '../models';

const router = express.Router();

router.get(
  '/api/inventory/me',
  requireAuth,
  async (req: Request, res: Response) => {
    const inventory = await Inventory.findAll({
      where: { userId: req.currentUser.id },
    });

    res.status(200).send(inventory);
  }
);

export { router as getUserInventoryRouter };
