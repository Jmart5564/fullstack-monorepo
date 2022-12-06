import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import Location from '../models/Location.js';
import authorize from '../middleware/authorize.js';

export default Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const locations = await Location.getAll(req.user.id);
      res.json(locations);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newLocation = await Location.insert({ ...req.body, user_id: req.user.id });
      res.json(newLocation);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const deletedLocation = await Location.delete(req.params.id);
      res.json(deletedLocation);
    } catch (e) {
      next(e);
    }
  });
