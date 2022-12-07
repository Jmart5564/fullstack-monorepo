import pool from '../server/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../server/app.js';
import UserService from '../server/services/UserService.js';

const mockUser = {
  firstName: 'momo',
  lastName: 'cat',
  email: 'momo@momo.com',
  password: 'momomomo',
};
const mockUser2 = {
  firstName: 'Stu',
  lastName: 'Cat',
  email: 'stu@stu.com',
  password: 'stuthecat',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('journals', () => {
  beforeEach(() => {
    return setup(pool);
  });
});
