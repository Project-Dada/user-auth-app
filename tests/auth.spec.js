const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
  });

  it('should login a user successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });
});
