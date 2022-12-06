import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// const authenticate = require('./middleware/authenticate');
import users from './controllers/users.js';
import locations from './controllers/locations.js';
import notFound from './middleware/not-found.js';
import error from './middleware/error.js';

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// App routes
app.use(
  cors({
    origin: ['http://localhost:7891'],
    credentials: true,
  })
);
app.use('/api/v1/users', users);
app.use('/api/v1/locations', locations);

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFound);
app.use(error);

export default app;
