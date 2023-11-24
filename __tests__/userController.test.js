const request = require('supertest');
const app = require('../testapp');
const mongoose = require('mongoose')
const User = require('../models/User');
const {getUserInfo} = require('../controllers/userController')

let server; // Variable to contain server references

beforeAll(() => {
    const port = 4001;
    server = app.listen(port);
})

// Close server connection
afterEach(async()=>{
    await server.close()
})
// Close database connection
afterAll(async () => {
    await mongoose.disconnect();
  });

  
describe('register', () => {
    it('should register a new user with valid data', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                name: 'TestUser',
                email: 'test@example.com',
                password: 'test123',
                cpassword: 'test123',
            });
        expect(response.body.msg).toBe('User created successfully!');
        await User.findOneAndDelete({name:'TestUser'})
    },15000);

    it('should return validation errors for invalid data', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                name: '', // Invalid: empty name
                email: 'invalid-email', // Invalid: not a valid email
                password: 'short', // Invalid: password too short
                cpassword: 'password', // Invalid: passwords do not match
            });
        expect(response.status).toBe(404);
        expect(response.body.errors.length).toBeGreaterThan(0);
        
    },1000);

    it('should return an error for an already existing username', async () => {
        const existingUser = new User({ name: 'ExistingUser',email:'existinguser@gmail.com' });
        await existingUser.save();

        const response = await request(app)
            .post('/api/register')
            .send({
                name: 'ExistingUser',
                email: 'newuser@example.com',
                password: 'test123',
                cpassword: 'test123',
            });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors[0].msg).toBe('We have user with that name');
        await User.findOneAndDelete({name:'ExistingUser'})
    },10000);

    it('should return an error for an already existing email', async () => {
        const existingUser = new User({ email: 'existinguser@example.com',name:'test' });
        await existingUser.save();

        const response = await request(app)
            .post('/api/register')
            .send({
                name: 'NewUser',
                email: 'existinguser@example.com',
                password: 'test123',
                cpassword: 'test123',
            });

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors[0].msg).toBe('We have user with that email');
        await User.findOneAndDelete({email: 'existinguser@example.com'})
    },1000);
},10000);

describe('getUserInfo',()=>{
    it('should send user info',async()=>{
        const newUser = new User({ name: 'ExistingUser',email:'existinguser@gmail.com' });
        await newUser.save();
        // Mocking the request object with training details
        const mockRequest = {
        params: { id: 'mockId' },
        };

         // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };        
        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(newUser);

        // Calling getUserInfo fn
        await getUserInfo(mockRequest,mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith(newUser);
        await User.findOneAndDelete({name: 'ExistingUser'})

        },10000)
    it('should send message "Didnt find"',async()=>{
        // Mocking the request object with training details
        const mockRequest = {
        params: { id: 'xxxx' },
        };

         // Mocking the response object
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };        
        // Mocking the necessary functions to resolve promises
        jest.spyOn(User, 'findById').mockResolvedValueOnce(null);

        // Calling getUserInfo fn
        await getUserInfo(mockRequest,mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith("Didnt find");
    })
},10000)


