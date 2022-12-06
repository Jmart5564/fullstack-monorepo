const pool = require('../server/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../server/app');
const UserService = require('../server/services/UserService');
import Location from '../server/models/Location';

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

describe('locations', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('POST /api/v1/locations creates a location data with the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const newItem = { latitude: 45.5152, longitude: 122.6784 };
    const resp = await agent.post('/api/v1/locations').send(newItem);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      latitude: newItem.latitude,
      longitude: newItem.longitude,
      user_id: user.id,
    });
  });

  it('GET /api/v1/locations returns all location data associated with the authenticated User', async () => {
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
    const resp = await agent.get('/api/v1/locations');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Location]);
  });
});
