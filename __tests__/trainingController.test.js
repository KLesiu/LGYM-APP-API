const {addTraining} = require('../controllers/trainingController')
const request = require('supertest');
const app = require('../index');
const server = require('../server')
const mongoose = require('mongoose')
const Training = require('../models/Training')
const Exercise = require('../models/Exercise')
const User = require('../models/User');
const Plan = require('../models/Plan');

// Close server connection
afterAll(async()=>{
    await server.close()
})
// Close database connection
afterAll(async () => {
    await mongoose.disconnect();
  });

describe('addTraining', () => {
    it('should add a training session', async () => {
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockPlan = new Plan({user:mockUser})
        // Mocking the request object with training details
        const mockRequest = {
            params: { id: mockUserId },
            body: {
                day: 'A',
                training: ['ExerciseA', 'ExerciseB'],
                createdAt: 'Thu Nov 23 2023 13:00:00 GMT+0100 (czas środkowoeuropejski standardowy)',
            },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Plan, 'findOne').mockResolvedValueOnce(mockPlan);

        // Calling the addTraining function
        await addTraining(mockRequest, mockResponse);

        // Expectations for the response message
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Training added' });
    });

    
});


