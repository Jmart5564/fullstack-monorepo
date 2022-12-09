import Location from '../models/Location.js';

export default async (req, res, next) => {
  try {
    if (req.method === 'PUT') {
      const location = await Location.getById(req.params.id);
      if (req.user.id !== location.user_id) {
        throw new Error('You do not have access to update this location');
      }
    }
    if (req.method === 'DELETE') {
      const location = await Location.getById(req.params.id);
      if (req.user.id !== location.user_id) {
        throw new Error('You do not have access to delete this location');
      }
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
