import express from 'express';
import { currentUser } from '@dpticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.json({ currentUser: req.user || null });
});

export { router as currentUserRouter };
