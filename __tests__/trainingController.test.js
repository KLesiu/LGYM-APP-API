const {addTraining, getTrainingHistory, getPreviousTrainingSession, getCurrentTrainingSession,checkPreviousTrainingSession} = require('../controllers/trainingController')
const request = require('supertest');
const app = require('../testapp');
const mongoose = require('mongoose')
const Training = require('../models/Training')
const Exercise = require('../models/Exercise')
const User = require('../models/User');
const Plan = require('../models/Plan');

let server; // Zmienna do przechowywania referencji do serwera

beforeAll(() => {
    const port = 4002
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
    },10000);

    
});

describe('getTrainingHistory',()=>{
    it('should send training history',async()=>{
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockTraining = new Training({user:mockUser,type:'A'})
        const mockTrainingTwo = new Training({user:mockUser,type:'B'})
         // Mocking the request object with user id
         const mockRequest = {
            params: { id: mockUserId },
        }; 
         // Mocking the response object
         const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        // Mocking the necessary functions to resolve promises
        jest.spyOn(Training,'create').mockResolvedValue(mockTraining)
        jest.spyOn(Training,'create').mockResolvedValue(mockTrainingTwo)
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue([{user: mockUser }]);


        // Calling the getTrainingHistory function
        await getTrainingHistory(mockRequest,mockResponse)
        expect(mockResponse.send).toHaveBeenCalledWith({ trainingHistory:[{user:mockUser}] });



    },10000)
    it('should send message "You dont have trainings!"',async()=>{
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
         // Mocking the request object with user id
         const mockRequest = {
            params: { id: mockUserId },
        }; 
         // Mocking the response object
         const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue([]);


        // Calling the getTrainingHistory function
        await getTrainingHistory(mockRequest,mockResponse)
        expect(mockResponse.send).toHaveBeenCalledWith({ msg:'You dont have trainings!' });

    },10000)
})

describe('getCurrentTrainingSession',()=>{
    it('should send current training',async()=>{
        const mockTrainingId = 'mockTrainingId';
        const mockTraining = new Training({_id:mockTrainingId})

         // Mocking the request object with user id
         const mockRequest = {
            params: { id: mockTrainingId },
        }; 
         // Mocking the response object
         const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises        
        jest.spyOn(Training,'findById').mockResolvedValueOnce(mockTraining);

        // Calling getCurrentTrainingSession
        await getCurrentTrainingSession(mockRequest,mockResponse)

        expect(mockResponse.send).toHaveBeenCalledWith({training:mockTraining});
    },10000)
    it('should send message "We dont find your training session!, Please logout and login one more time"',async()=>{
        const mockTrainingId = 'mockTrainingId';
        const mockTraining = new Training({_id:mockTrainingId})

         // Mocking the request object with user id
         const mockRequest = {
            params: { id: mockTrainingId },
        }; 
         // Mocking the response object
         const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises        
        jest.spyOn(Training,'findById').mockResolvedValueOnce(null);

        // Calling getCurrentTrainingSession
        await getCurrentTrainingSession(mockRequest,mockResponse)

        expect(mockResponse.send).toHaveBeenCalledWith({msg:'We dont find your training session!, Please logout and login one more time'});
    },10000)
})

describe('getPreviousTrainingSession', () => {
    it('should send previous training session', async () => {
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockTraining = new Training({ user: mockUser, type: 'A' });

        // Mocking the request object with user id
        const mockRequest = {
            params: { id: mockUserId, day: 'A' },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(Training, 'create').mockResolvedValue(mockTraining);
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue([mockTraining]); 

        // Calling getPreviousTrainingSession
        await getPreviousTrainingSession(mockRequest, mockResponse);

        expect(mockResponse.send).toHaveBeenCalledWith({ prevSession: mockTraining }); 
    },10000);
    it('should message "Didnt find previous session training"',async()=>{
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId });
        const mockTraining = new Training({ user: mockUser, type: 'B' });

        // Mocking the request object with user id
        const mockRequest = {
            params: { id: mockUserId, day: 'A' },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(Training, 'create').mockResolvedValue(mockTraining);
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue(null); 

        // Calling getPreviousTrainingSession
        await getPreviousTrainingSession(mockRequest, mockResponse);

        expect(mockResponse.send).toHaveBeenCalledWith({msg: 'Didnt find previous session training'}); 
    },10000)
});

describe('checkPreviousTrainingSession', () => {
    it('should send "Yes" when previous session exists', async () => {
        // Mock data
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId, plan: 'mockPlan' });
        const mockTraining = new Training({ user: mockUser, type: 'A', plan: 'mockPlan' });

        // Mocking the request object with user id
        const mockRequest = {
            params: { id: mockUserId, day: 'A' },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue([mockTraining]);

        // Calling checkPreviousTrainingSession
        await checkPreviousTrainingSession(mockRequest, mockResponse);

        // Expectations
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'Yes' });
    },10000);

    it('should send "No" when previous session does not exist', async () => {
        // Mock data
        const mockUserId = 'mockUserId';
        const mockUser = new User({ _id: mockUserId, plan: 'mockPlan' });

        // Mocking the request object with user id
        const mockRequest = {
            params: { id: mockUserId, day: 'A' },
        };

        // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(mockUser);
        jest.spyOn(Training, 'find').mockResolvedValue([]); // Pusta tablica oznacza brak poprzednich sesji treningowych

        // Calling checkPreviousTrainingSession
        await checkPreviousTrainingSession(mockRequest, mockResponse);

        // Expectations
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({ msg: 'No' });
    },10000);
});






