const express = require("express");
const ShoppingListService = require("../service/shoppingList-service");
const router = express.Router();

router.post('/create', async (req, res) => {
    await ShoppingListService.createShoppingList(req, res)
});

router.get('/list', async (req, res) => {
    await ShoppingListService.getAllShoppingLists(req, res)
});

router.get('/:id/detail', async (req, res) => {
    await ShoppingListService.getShoppingList(req, res)
});
router.put('/:id/update', async (req, res) => {
    await ShoppingListService.updateShoppingList(req, res)
});

router.delete('/:id/delete', async (req, res) => {
    await ShoppingListService.deleteShoppingList(req, res)
});

module.exports = router;