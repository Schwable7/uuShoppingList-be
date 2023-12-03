const { createShoppingList } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model
const Ajv = require('ajv');

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model
jest.mock('ajv'); // Mock AJV validation

describe('createShoppingList', () => {
    // Mock the res object
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should create a shopping list successfully', async () => {
        const req = {
            body: {
                title : "Groceries",
                owner: {
                    id: "test@email.cz",
                    name: "Michal"
                },
                members: [
                    {
                        id: "test@email.cz",
                        name: "Michal"
                    }
                ]
            }
        };
        Ajv.prototype.validate = jest.fn().mockReturnValue(true); // Mock validation to always pass
        ShoppingList.create.mockResolvedValue(req.body); // Mock the model's create function

        await createShoppingList(req, res);

        expect(res.json).toHaveBeenCalledWith(req.body);
        expect(ShoppingList.create).toHaveBeenCalledWith(req.body);
    });

    it('should return a 400 status code on validation failure', async () => {
        const req = {
            body: {
                title : "Groceries",
                owner: {
                    id: "test@email.cz",
                    name: "Michal"
                },
                members: [
                    {
                        id: "test@email.cz",
                        name: "Michal"
                    }
                ]
            }
        };

        // Mock AJV validation to fail
        Ajv.prototype.validate = jest.fn().mockReturnValue(false);
        Ajv.prototype.errors = [{ message: 'Validation error' }];

        await createShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            errorMessage: "validation of input failed",
            params: req.body,
            reason: [{ message: 'Validation error' }]
        });
    });
});