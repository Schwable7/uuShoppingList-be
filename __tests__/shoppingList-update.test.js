const { updateShoppingList } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model
const Ajv = require('ajv');

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model
jest.mock('ajv'); // Mock AJV validation

describe('updateShoppingList', () => {
    const mockShoppingList = {
        _id: '6568d059fdcd4c283459a053',
        title: 'Original Title',
        owner: { id: 'ownerId', name: 'Owner' },
        archived: false
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a shopping list successfully', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'ownerId' },
            body: { title: 'Updated Title', archived: true }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });
        ShoppingList.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ ...mockShoppingList, ...req.body })
        });
        Ajv.prototype.validate = jest.fn().mockReturnValue(true);

        await updateShoppingList(req, res);

        expect(Ajv.prototype.validate).toHaveBeenCalledWith(expect.any(Object), req.body);
        expect(ShoppingList.findByIdAndUpdate).toHaveBeenCalledWith('6568d059fdcd4c283459a053', { $set: req.body }, { new: true });
        expect(res.json).toHaveBeenCalledWith({ ...mockShoppingList, ...req.body });
    });

    it('should return 400 if shopping list does not exist', async () => {
        const req = {
            params: { id: 'invalidShoppingListId' },
            user: { userEmail: 'ownerId' },
            body: {}
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await updateShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('should return 403 if user is not the owner', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'nonOwnerId' },
            body: {}
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await updateShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 400 on validation failure', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'ownerId' },
            body: { title: 123 } // Invalid title format
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });
        Ajv.prototype.validate = jest.fn().mockReturnValue(false);
        Ajv.prototype.errors = [{ message: 'Validation error' }];

        await updateShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            errorMessage: "validation of input failed",
            params: req.body,
            reason: [{ message: 'Validation error' }]
        });
    });

    it('should handle unexpected errors', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'ownerId' },
            body: { title: 'Updated Title' }
        };
        ShoppingList.findById.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        await updateShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
});
