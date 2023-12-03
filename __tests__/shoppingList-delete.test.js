const { deleteShoppingList } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model

describe('deleteShoppingList', () => {
    const mockShoppingList = {
        _id: 'validShoppingListId',
        title: 'Groceries',
        owner: { id: 'ownerId', name: 'Owner' }
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a shopping list successfully', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'ownerId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });
        ShoppingList.findByIdAndDelete.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await deleteShoppingList(req, res);

        expect(ShoppingList.findByIdAndDelete).toHaveBeenCalledWith('validShoppingListId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "shopping list with id: validShoppingListId was successfully deleted" });
    });

    it('should return 403 if user is not the owner', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'nonOwnerId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await deleteShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 400 if shopping list does not exist', async () => {
        const req = {
            params: { id: 'invalidShoppingListId' },
            user: { userEmail: 'ownerId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await deleteShoppingList(req, res);

        expect(ShoppingList.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('should handle unexpected errors', async () => {
        const req = {
            params: { id: 'validShoppingListId' },
            user: { userEmail: 'ownerId' }
        };
        const errorMessage = 'Unexpected error';
        ShoppingList.findById.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        await deleteShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});
