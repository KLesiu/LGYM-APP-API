const { setPlanConfig, getPlanConfig, setPlan, getPlan, deletePlan } = require('../controllers/planController');
const User = require('../models/User');
const Plan = require('../models/Plan');
const request = require('supertest');
const app = require('../index');
const server = require('../server')
const mongoose = require('mongoose')

// Close server connection
afterAll(async()=>{
    await server.close()
})
// Close database connection
afterAll(async () => {
    await mongoose.disconnect();
  });
describe('setPlanConfig', () => {
    it('should set plan configuration for a user', async () => {
      // Mock request object with necessary data
      const mockRequest = {
        body: { name: 'TestPlan', days: 5 },
        params: { id: 'mockUserId' },
      };
      
      // Mock response object with a jest function
      const mockResponse = {
        send: jest.fn(),
      };
  
      // Mock user and plan objects for testing
      const mockUser = new User({ _id: 'mockUserId' });
      const mockPlan = new Plan({ user: mockUser, name: 'TestPlan', trainingDays: 5 });
  
      // Mocking MongoDB operations using jest spies
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(Plan, 'create').mockResolvedValue(mockPlan);
      jest.spyOn(mockUser, 'updateOne').mockResolvedValue();
  
      // Call the function to be tested
      await setPlanConfig(mockRequest, mockResponse);
  
      // Assertions to verify if the expected MongoDB operations were called
      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(Plan.create).toHaveBeenCalledWith({
        user: mockUser,
        name: 'TestPlan',
        trainingDays: 5,
      });
      expect(mockUser.updateOne).toHaveBeenCalledWith({ plan: mockPlan });
      
      // Verify if the response object was sent with the expected message
      expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Created' });
    }, 1000); // Set timeout for the test case to 1000ms
  
  });
  
describe('getPlanConfig', () => {
    it('should get plan configuration for a user', async () => {
      // Mock user and plan objects for testing
      const mockUserId = 'mockUserId';
      const mockUser = new User({ _id: mockUserId });
      const mockPlan = new Plan({ user: mockUser, trainingDays: 5 });
  
      // Mocking MongoDB operations using jest spies
      jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
      jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(mockPlan);
  
      // Make an HTTP request to the getPlanConfig endpoint
      const response = await request(app).get(`/api/${mockUserId}/configPlan`);
  
      // Assertions to verify if the expected response was received
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: mockPlan.trainingDays });
  
      // Assertions to verify if the expected MongoDB operations were called
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Plan.findOne).toHaveBeenCalledWith({ user: mockUser });
    }, 1000); // Set timeout for the test case to 1000ms
  
  });
  describe('setPlan', () => {
    it('should update plan with one day of exercises', async () => {
        // Mocking user and plan objects
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockPlan = new Plan({ user: mockUser });

        // Mocking the request object with one day of exercises
        const mockRequest = {
            params: { id: mockUserId },
            body: { days: { days: [{ exercises: ['ExerciseA'] }] } },
        };

        // Mocking the response object
        const mockResponse = {
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(mockPlan);
        jest.spyOn(mockPlan, 'updateOne').mockResolvedValueOnce();

        // Calling the setPlan function
        await setPlan(mockRequest, mockResponse);

        // Expectations for the update based on the provided exercises
        expect(mockPlan.updateOne).toHaveBeenCalledWith({ planA: ['ExerciseA'] });

        // Expectations for the response message
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Updated' });
    });

    it('should update plan with two days of exercises', async () => {
        // Mocking user and plan objects
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockPlan = new Plan({ user: mockUser });

        // Mocking the request object with two days of exercises
        const mockRequest = {
            params: { id: mockUserId },
            body: { days: { days: [{ exercises: ['ExerciseA'] }, { exercises: ['ExerciseB'] }] } },
        };

        // Mocking the response object
        const mockResponse = {
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(mockPlan);
        jest.spyOn(mockPlan, 'updateOne').mockResolvedValueOnce();

        // Calling the setPlan function
        await setPlan(mockRequest, mockResponse);

        // Expectations for the update based on the provided exercises
        expect(mockPlan.updateOne).toHaveBeenCalledWith({
            planA: ['ExerciseA'],
            planB: ['ExerciseB'],
        });

        // Expectations for the response message
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Updated' });
    });
});

  



