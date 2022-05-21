import { NotFoundError, validateRequest } from '@dpticketing/common';
import { Request, Response, Router } from 'express';
import { CustomSanitizer, CustomValidator, param } from 'express-validator';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const router = Router();

const validateId: CustomValidator = (value) => {
  return new mongoose.Types.ObjectId(value);
};

router.get(
  '/api/tickets/:id',
  validateRequest([
    param('id').custom(validateId).withMessage('Id is invalid'),
  ]),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.json(ticket);
  }
);

export { router as showTicketRouter };
