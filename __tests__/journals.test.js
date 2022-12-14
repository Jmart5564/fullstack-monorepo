import pool from '../server/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../server/app.js';
import UserService from '../server/services/UserService.js';
import Journal from '../server/models/Journal.js';
import Location from '../server/models/Location.js';

const mockUser = {
  firstName: 'momo',
  lastName: 'cat',
  email: 'momo@momo.com',
  password: 'momomomo',
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

  it('POST /api/v1/journals creates a new journal entry for the current location', async () => {
    const [agent, user] = await registerAndLogin();
    const user1Location = await Location.insert({
      id: 1,
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user.id,
    });
    const newJournal = { date: '2022-12-13', details: 'woot!', location_id: user1Location.id };
    const resp = await agent.post('/api/v1/journals').send(newJournal);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      date: newJournal.date,
      details: newJournal.details,
      location_id: user1Location.id,
    });
  });

  it('GET /api/v1/journals returns all journal entries associated with the specific location id', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    const user1Location = await Location.insert({
      id: 1,
      latitude: 44.2456,
      longitude: 126.8735,
      user_id: user.id,
    });
    const user1Journal = await Journal.insert({
      date: '2022-12-13',
      details: 'found it!',
      location_id: user1Location.id,
    });
    const resp = await agent.get('/api/v1/journals');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Journal]);
  });
});
