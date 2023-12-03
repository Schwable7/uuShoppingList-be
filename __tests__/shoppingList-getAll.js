const { getAllShoppingLists } = require('../service/shoppingList-service'); // adjust the path accordingly
const ShoppingList = require('../model/shoppingList.model'); // Import your model

jest.mock('../model/shoppingList.model'); // Mock the ShoppingList model

describe('getAllShoppingLists', () => {
    const mockUserId = 'userEmail@example.com';
    const mockShoppingLists = [
        {
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
        },
        {
            _id: '6568d059fccd4x283459a053',
            title: 'Drug store',
            owner: { id: 'ownerId', name: 'Owner' },
            members: [{ id: 'memberId', name: 'Member' }],
            items: [
                {
                    name: "Shampoo"
                },
                {
                    name: "Toothpaste"
                }
            ]
        }
    ];
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve all shopping lists successfully', async () => {
        const req = {
            user: { userEmail: mockUserId },
            body: { currentPage: 1, pageSize: 10 }
        };
        ShoppingList.countDocuments.mockResolvedValue(mockShoppingLists.length);
        ShoppingList.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockShoppingLists)
        });

        await getAllShoppingLists(req, res);

        expect(res.json).toHaveBeenCalledWith({
            shoppingLists: mockShoppingLists,
            pagination: { totalLists: mockShoppingLists.length, currentPage: 1, pageSize: 10 }
        });
    });

    it('should handle empty shopping lists', async () => {
        const req = {
            user: { userEmail: mockUserId },
            body: { currentPage: 1, pageSize: 10 }
        };
        ShoppingList.countDocuments.mockResolvedValue(0);
        ShoppingList.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });

        await getAllShoppingLists(req, res);

        expect(res.json).toHaveBeenCalledWith({
            shoppingLists: [],
            pagination: { totalLists: 0, currentPage: 1, pageSize: 10 }
        });
    });

    it('should handle pagination correctly', async () => {
        const req = {
            user: { userEmail: mockUserId },
            body: { currentPage: 2, pageSize: 5 }
        };
        // Mock responses and logic for pagination...

        await getAllShoppingLists(req, res);

        // Assertions for pagination logic...
    });

    it('should handle errors correctly', async () => {
        const req = {
            user: { userEmail: mockUserId },
            body: { currentPage: 1, pageSize: 10 }
        };
        const errorMessage = 'Error fetching data';
        ShoppingList.countDocuments.mockRejectedValue(new Error(errorMessage));

        await getAllShoppingLists(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});
