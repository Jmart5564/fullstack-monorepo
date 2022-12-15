import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import Journal from '../models/Journal.js';

export default Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      console.log('backend journals');
      const journals = await Journal.getAll(req.params.id);
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
