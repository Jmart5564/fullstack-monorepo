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

  it('GET /api/v1/journals returns all journal entries associated with the specific location id', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    // add a second user with items
    const user2 = await UserService.create(mockUser2);
    const user1Location = await Location.insert({
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user.id,
    });
    await Location.insert({
      latitude: 46.2935,
      longitude: 121.3927,
      user_id: user2.id,
    });
    const resp = await agent.get('/api/v1/journals');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Location]);
  });
});
