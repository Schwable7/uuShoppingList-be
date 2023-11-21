const Ajv = require("ajv").default;
const ShoppingList = require("../model/shoppingList.model");
const { shoppingListCreateSchema} = require("../validation-schemas/shopping-list-schemas");

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
        //TODO
    }

    async getAllShoppingLists(req, res) {
        //TODO
    }

    async updateShoppingList(req, res) {
        //TODO
    }

    async deleteShoppingList(req, res) {
        //TODO
    }

    async addItem(req, res) {
        //TODO
    }

    async removeItem(req, res) {
        //TODO
    }

    async updateItem(req, res) {
        //TODO
    }

    async addMember(req, res) {
        //TODO
    }

    async removeMember(req, res) {
        //TODO
    }


}

module.exports = new ShoppingListService();