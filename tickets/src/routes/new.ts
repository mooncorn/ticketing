import { requireAuth, validateRequest } from '@dpticketing/common';
import { Response, Request, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = Router();

router.post(
  '/api/tickets',
  requireAuth,
  validateRequest([
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ]),
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.user!.id,
    });

    await ticket.save();

    res.status(201).json(ticket.toJSON());
  }
);

export { router as createTicketRouter };
