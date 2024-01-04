const request = require('supertest');
const app = require('./app');
const { expect } = require('expect');
const User = require('./models/usermodel');
const cloudinary = require('cloudinary');


jest.mock('./models/usermodel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

describe('API Endpoint Tests', () => {
  beforeAll(() => {
   
    cloudinary.v2.uploader.upload.mockResolvedValue({
      public_id: 'mocked_public_id',
      secure_url: 'https://mocked_secure_url.com',
    });
  });

  it('POST /api/v1/register should register a new user', async () => {
    
    User.findOne.mockResolvedValue(null);

    
    const mockUser = {
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword', 
      avatar: { public_id: 'mocked_public_id', url: 'https://mocked_secure_url.com' },
      getJWTToken: jest.fn().mockReturnValue('mocked-jwt-token'), 
    };
    User.create.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
    expect(User.create).toHaveBeenCalledWith({
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'password123', 
      avatar: { public_id: 'mocked_public_id', url: 'https://mocked_secure_url.com' },
    });

   
    expect(response.status).toBe(201);
  });

  
});
