import pool from '../server/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../server/app.js';
import UserService from '../server/services/UserService.js';

const mockUser = {
  email: 'test@example.com',
  password: '123456',
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

describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/users creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('GET /api/v1/users/me returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');
    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('DELETE /api/v1/users/sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');
    expect(me.status).toBe(200);
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
});
