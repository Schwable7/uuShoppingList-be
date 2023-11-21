const express = require("express");
const ShoppingListService = require("../service/shoppingList-service");
const router = express.Router();

router.post('/create', async (req, res) => {
    await ShoppingListService.createShoppingList(req, res)
});

router.get('/getAll', async (req, res) => {
    await ShoppingListService.getAllShoppingLists()
});

router.get('/:id/detail', async (req, res) => {
    await ShoppingListService.getShoppingList()
});
router.put('/:id/update', async (req, res) => {
    await ShoppingListService.updateShoppingList()
});

router.delete('/:id/delete', async (req, res) => {
    await ShoppingListService.deleteShoppingList()
});

router.post('/:id/addItem', async (req, res) => {
    await ShoppingListService.addItem()
});

router.delete('/:id/removeItem', async (req, res) => {
    await ShoppingListService.removeItem()
});

router.put('/:id/updateItem', async (req, res) => {
    await ShoppingListService.updateItem()
});

router.post('/:id/addMember', async (req, res) => {
    await ShoppingListService.addMember()
});

router.delete('/:id/removeMember', async (req, res) => {
    await ShoppingListService.removeMember()
});

module.exports = router;