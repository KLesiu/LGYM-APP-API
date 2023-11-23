const { setPlanConfig, getPlanConfig, setPlan, getPlan, deletePlan } = require('../controllers/planController');
const User = require('../models/User');
const Plan = require('../models/Plan');
const request = require('supertest');
const app = require('../index');

const mongoose = require('mongoose')


let server; // Zmienna do przechowywania referencji do serwera

beforeAll(() => {
    const port = 4000;
    server = app.listen(port);
});
// Close server connection
afterEach(async()=>{
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
    }, 10000); // Set timeout for the test case to 1000ms
  
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
    }, 10000); // Set timeout for the test case to 1000ms
  
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
    },10000);

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
    },10000);
});

describe('getPlan', () => {
    it('should return the plan data when plan is found', async () => {
        // Mocking user and plan objects
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockPlan = new Plan({
            user: mockUser,
            planA: ['ExerciseA'],
            planB: ['ExerciseB'],
            // Include other plan data as needed
        });

        // Mocking the request object
        const mockRequest = {
            params: { id: mockUserId },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(mockPlan);

        // Calling the getPlan function
        await getPlan(mockRequest, mockResponse);

        // Expectations for the response status and data
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({
            data: {
                planA: ['ExerciseA'],
                planB: ['ExerciseB'],
                planC:  [],
                planD:  [],
                planE:  [],
                planF:  [],
                planG:  [],
            },
        });
    },10000);

    it('should return a 404 response when plan is not found', async () => {
        // Mocking user object
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });

        // Mocking the request object
        const mockRequest = {
            params: { id: mockUserId },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(null);

        // Calling the getPlan function
        await getPlan(mockRequest, mockResponse);

        // Expectations for the response status and data
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({ data: 'Didnt find' });
    },10000);
});


describe('deletePlan', () => {
    it('should delete the plan and return a success message when plan is found', async () => {
        // Mocking user object
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });

        // Mocking the request object
        const mockRequest = {
            params: { id: mockUserId },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };

        // Mocking the Plan.findOneAndDelete result
        const mockDeletedPlan = {
            // Include mock data as needed
        };
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOneAndDelete').mockResolvedValueOnce(mockDeletedPlan);

        // Mocking the User.updateOne result
        jest.spyOn(mockUser, 'updateOne').mockResolvedValueOnce();

        // Calling the deletePlan function
        await deletePlan(mockRequest, mockResponse);

        // Expectations for the response status and data
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Deleted!' });

        // Expectations for the function calls
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(Plan.findOneAndDelete).toHaveBeenCalledWith({ user: mockUser });
        expect(mockUser.updateOne).toHaveBeenCalledWith({ $unset: { plan: 1 } }, { new: true });
    },10000);
});

  



