const request = require('supertest');
const passport = require('passport');
const express = require('express');
const app = express();
const User = require('../models/User')
const {verifyCallback} = require('../config/passport')

// Mock the User model and its methods
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
}));

// Mock passport module
jest.mock('passport', () => ({
  use: jest.fn(),
}));

describe('verifyCallback', () => {
  it('should call done with user if user is found', async () => {
    // Mock user data
    const mockUser = { _id: 'someUserId', username: 'testUser' };

    // Mock User.findOne to resolve with mock user
    User.findOne.mockResolvedValue(mockUser);

    // Mock done function
    const done = jest.fn();

    // Call verifyCallback with a mock payload
    await verifyCallback({ id: 'someUserId' }, done);

    // Expect User.findOne to have been called
    expect(User.findOne).toHaveBeenCalledWith({ _id: 'someUserId' });

    // Expect done to have been called with null and the mock user
    expect(done).toHaveBeenCalledWith(null, mockUser);
  },10000);

  it('should call done with error if user is not found', async () => {
    // Mock User.findOne to reject with an error
    User.findOne.mockRejectedValue(new Error('User not found'));

    // Mock done function
    const done = jest.fn();

    // Call verifyCallback with a mock payload
    await verifyCallback({ id: 'someUserId' }, done);

    // Expect User.findOne to have been called
    expect(User.findOne).toHaveBeenCalledWith({ _id: 'someUserId' });

    // Expect done to have been called with an error
    expect(done).toHaveBeenCalledWith(new Error('User not found'));
  },10000);
});

