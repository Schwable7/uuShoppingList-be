const express = require("express");
const ShoppingListService = require("../service/shoppingList-service");
const router = express.Router();

router.post('', async (req, res) => {
    await ShoppingListService.createShoppingList(req, res)
});

router.get('', async (req, res) => {
    await ShoppingListService.getAllShoppingLists(req, res)
});

router.get('/:id', async (req, res) => {
    await ShoppingListService.getShoppingList(req, res)
});
router.put('/:id', async (req, res) => {
    await ShoppingListService.updateShoppingList(req, res)
});

router.put('/:id/members', async (req, res) => {
    await ShoppingListService.updateShoppingListMembers(req, res)
});

router.put('/:id/items', async (req, res) => {
    await ShoppingListService.updateShoppingListItems(req, res)
});

router.delete('/:id', async (req, res) => {
    await ShoppingListService.deleteShoppingList(req, res)
});

module.exports = router;