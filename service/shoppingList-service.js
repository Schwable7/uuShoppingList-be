const Ajv = require("ajv").default;
const ShoppingList = require("../model/shoppingList.model");
const {
    shoppingListCreateSchema,
    shoppingListUpdateSchema
} = require("../validation-schemas/shopping-list-schemas");

class ShoppingListService {
    async createShoppingList(req, res) {
        const ajv = new Ajv();
        try {
            const valid = ajv.validate(shoppingListCreateSchema, req.body);
            if (valid) {
                let shoppingList = req.body;
                shoppingList = await ShoppingList.create(shoppingList);
                res.json(shoppingList);
            } else {
                res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async getShoppingList(req, res) {
        const shoppingListId = req.params.id;
        try {
            const shoppingList = await ShoppingList.findById(shoppingListId).lean();
            if (!shoppingList) {
                res.status(400).send({error: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            res.json(shoppingList);
        } catch (error) {
            if (error.message.startsWith("Cast to ObjectId failed")) {
                res.status(400).json({message: "shopping list with id: " + shoppingListId + " does not exist"});
            }
            else {
                res.status(500).json({message: error.message});
            }
        }
    }

    async getAllShoppingLists(req, res) {
        try {
            let shoppingLists = await ShoppingList.find().lean();
            res.json(shoppingLists);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async updateShoppingList(req, res) {
        const ajv = new Ajv();
        const shoppingListId = req.params.id;
        try {
            const valid = ajv.validate(shoppingListUpdateSchema, req.body);
            if (valid) {
                let shoppingList = await ShoppingList.findByIdAndUpdate(shoppingListId, req.body, {new: true}).lean();
                res.json(shoppingList);
            } else {
                res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async deleteShoppingList(req, res) {
        const shoppingListId = req.params.id;
        try {
            let shoppingList = await ShoppingList.findByIdAndDelete(shoppingListId).lean();
            if (!shoppingList) {
                res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            } else {
                res.status(200).json({message: "shopping list with id: " + shoppingListId + " was successfully deleted"});
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

}

module.exports = new ShoppingListService();