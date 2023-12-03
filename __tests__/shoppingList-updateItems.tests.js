const { updateShoppingListItems } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model
const Ajv = require('ajv');

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model
jest.mock('ajv'); // Mock AJV validation

describe('updateShoppingListItems', () => {
    const mockShoppingList = {
        _id: 'validShoppingListId',
        title: 'Groceries',
        owner: { id: 'ownerId', name: 'Owner' },
        members: [{ id: 'memberId', name: 'Member' }],
        items: [{ name: 'Milk' }, { name: 'Bread' }]
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update shopping list items successfully', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'ownerId' },
            body: { items: [{ name: 'Eggs' }, { name: 'Butter' }] }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });
        ShoppingList.findByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ ...mockShoppingList, items: req.body.items })
        });
        Ajv.prototype.validate = jest.fn().mockReturnValue(true);

        await updateShoppingListItems(req, res);

        expect(Ajv.prototype.validate).toHaveBeenCalledWith(expect.any(Object), req.body);
        expect(ShoppingList.findByIdAndUpdate).toHaveBeenCalledWith('validShoppingListId', { $set: { items: req.body.items } }, { new: true });
        expect(res.json).toHaveBeenCalledWith({ ...mockShoppingList, items: req.body.items });
    });

    it('should return 400 if shopping list does not exist', async () => {
        const req = {
            params: { id: 'invalidShoppingListId' },
            user: { userEmail: 'ownerId' },
            body: { items: [] }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await updateShoppingListItems(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('should return 403 if user is not the owner or a member', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'nonOwnerId' },
            body: { items: [] }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await updateShoppingListItems(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 400 on validation failure', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'ownerId' },
            body: { items: "invalidItemsFormat" } // Assuming this is an invalid format
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });
        Ajv.prototype.validate = jest.fn().mockReturnValue(false);
        Ajv.prototype.errors = [{ message: 'Validation error' }];

        await updateShoppingListItems(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            errorMessage: "validation of input failed",
            params: req.body,
            reason: Ajv.prototype.errors,
        });
    });

    it('should handle unexpected errors', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'ownerId' },
            body: { items: [] }
        };
        ShoppingList.findById.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        await updateShoppingListItems(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
    });
});
