import {
  NotFoundError,
  requireAuth,
  UnauthorizedRequestError,
  validateRequest,
} from '@dpticketing/common';
import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { Ticket } from '../models/ticket';
import { validateId } from './show';

const router = Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  validateRequest([
    param('id').custom(validateId).withMessage('Id is invalid'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('title').not().isEmpty().withMessage('Title is required'),
  ]),
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.user!.id != ticket.userId) {
      throw new UnauthorizedRequestError();
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: req.params.id },
      { title, price },
      { returnOriginal: false }
    );

    res.json(updatedTicket);
  }
);

export { router as updateTicketRouter };
