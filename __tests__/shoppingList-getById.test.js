const { getShoppingList } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model

describe('getShoppingList', () => {
    const mockShoppingList = {
        _id: '6568d059fdcd4c283459a053',
        title: 'Groceries',
        owner: { id: 'ownerId', name: 'Owner' },
        members: [{ id: 'memberId', name: 'Member' }],
        items: [
            {
                name: "Milk"
            },
            {
                name: "Apple"
            }
        ]
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve a shopping list successfully for the owner', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'ownerId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await getShoppingList(req, res);

        expect(res.json).toHaveBeenCalledWith(mockShoppingList);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should retrieve a shopping list successfully for a member', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'memberId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await getShoppingList(req, res);

        expect(res.json).toHaveBeenCalledWith(mockShoppingList);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 if user is neither owner nor member', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'nonMemberId' }
        };
        ShoppingList.findById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockShoppingList)
        });

        await getShoppingList(req, res);

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

        await getShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 400 for invalid shopping list ID', async () => {
        const invalidId = '123456789abc'; // Example of an invalid ObjectId
        const req = {
            params: { id: invalidId },
            user: { userEmail: 'ownerId' }
        };

        // Simulate the behavior of findById with an invalid ObjectId
        ShoppingList.findById.mockImplementation(id => {
            if (id === invalidId) {
                throw new Error("Cast to ObjectId failed for value \"" + id + "\"");
            }
            return Promise.resolve(mockShoppingList);
        });

        await getShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('should handle unexpected errors', async () => {
        const req = {
            params: { id: '6568d059fdcd4c283459a053' },
            user: { userEmail: 'ownerId' }
        };
        ShoppingList.findById.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        await getShoppingList(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error" });
    });
});
