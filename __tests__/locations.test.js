import pool from '../server/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../server/app.js';
import UserService from '../server/services/UserService.js';
import Location from '../server/models/Location.js';

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

  it('POST /api/v1/locations creates a location data with the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const newLocation = { latitude: '45.5152', longitude: '122.6784' };
    const resp = await agent.post('/api/v1/locations').send(newLocation);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
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

  it('GET /api/v1/locations should return a 401 if not authenticated', async () => {
    const resp = await request(app).get('/api/v1/locations');
    expect(resp.status).toEqual(401);
  });

  it('UPDATE /api/v1/locations/:id should update an location', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    const location = await Location.insert({
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user.id,
    });
    const resp = await agent.put(`/api/v1/locations/${location.id}`).send({ latitude: '41.2356' });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: location.id,
      latitude: '41.2356',
      longitude: '126.8735',
      user_id: user.id,
    });
  });

  it('UPDATE /api/v1/locations/:id should 403 for invalid users', async () => {
    // create a user
    const [agent] = await registerAndLogin();
    // create a second user
    const user2 = await UserService.create(mockUser2);
    const location = await Location.insert({
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user2.id,
    });
    const resp = await agent.put(`/api/v1/locations/${location.id}`).send({ latitude: 40.2845 });
    expect(resp.status).toBe(403);
  });

  it('DELETE /api/v1/locations/:id should delete locations for valid user', async () => {
    const [agent, user] = await registerAndLogin();
    const location = await Location.insert({
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user.id,
    });
    const resp = await agent.delete(`/api/v1/locations/${location.id}`);
    expect(resp.status).toBe(200);

    const check = await Location.getById(location.id);
    expect(check).toBeNull();
  });
});
