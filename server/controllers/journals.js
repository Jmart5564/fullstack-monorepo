import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import Journal from '../models/Journal.js';

export default Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const journals = await Journal.getAll(req.user.id);
      res.json(journals);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newJournal = await Journal.insert({ ...req.body, user_id: req.user.id });
      res.json(newJournal);
    } catch (e) {
      next(e);
    }
  });
