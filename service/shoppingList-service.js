const Ajv = require("ajv").default;
const ShoppingList = require("../model/shoppingList.model");
const {
    shoppingListCreateSchema,
    shoppingListUpdateSchema,
    shoppingListUpdateItemsSchema,
    shoppingListUpdateMembersSchema
} = require("../validation-schemas/shopping-list-schemas");

class ShoppingListService {
    async createShoppingList(req, res) {
        const ajv = new Ajv();
        try {
            const valid = ajv.validate(shoppingListCreateSchema, req.body);
            if (!valid) {
                res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            } else {
                let shoppingList = req.body;
                shoppingList = await ShoppingList.create(shoppingList);
                return res.json(shoppingList);
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async getShoppingList(req, res) {
        const shoppingListId = req.params.id;
        try {
            const shoppingList = await ShoppingList.findById(shoppingListId).lean();
            const userId = req.user.userEmail;
            if (!shoppingList) {
                return res.status(400).send({error: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            if (userId !== shoppingList.owner.id && !shoppingList.members.includes(userId)) {
                res.status(403).send({error: `user with id '${userId}' is not allowed to access this shopping list'`});
            }
            return res.status(200).json(shoppingList);
        } catch (error) {
            if (error.message.startsWith("Cast to ObjectId failed")) {
                return res.status(400).json({message: "shopping list with id: " + shoppingListId + " does not exist"});
            }
            else {
                return res.status(500).json({message: error.message});
            }
        }
    }

    async getAllShoppingLists(req, res) {
        try {
            const userId = req.user.userEmail;
            const { currentPage, pageSize } = req.body;
            const skip = (currentPage - 1) * pageSize;

            const totalLists = await ShoppingList.countDocuments({
                $or: [{ 'owner.id': userId }, { members: { $in: [userId] } }]
            });

            let shoppingLists = await ShoppingList.find({
                $or: [{ 'owner.id': userId }, { members: { $in: [userId] } }]
            })
                .skip(skip)
                .limit(pageSize)
                .lean();

            return res.json({
                shoppingLists,
                pagination: {
                    totalLists,
                    currentPage,
                    pageSize
                }
            });
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    // Serves to update title and/or archived status
    async updateShoppingList(req, res) {
        const ajv = new Ajv();
        const shoppingListId = req.params.id;
        try {
            const userId = req.user.userEmail;
            const shoppingList = await ShoppingList.findById(shoppingListId).lean();
            if (!shoppingList) {
                return res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            if (userId !== shoppingList.owner.id) {
                res.status(403).send({error: `user with id '${userId}' is not allowed to update this shopping list'`});
            }

            const valid = ajv.validate(shoppingListUpdateSchema, req.body);
            if (valid) {
                // Prepare the update object
                const update = {};
                if ('title' in req.body) update.title = req.body.title;
                if ('archived' in req.body) update.archived = req.body.archived;

                let updatedShoppingList = await ShoppingList.findByIdAndUpdate(
                    shoppingListId,
                    { $set: update },
                    { new: true }
                ).lean();

                res.json(updatedShoppingList);
            } else {
                return res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async updateShoppingListMembers(req, res) {
        const ajv = new Ajv();
        const shoppingListId = req.params.id;
        try {
            const userId = req.user.userEmail;
            const shoppingList = await ShoppingList.findById(shoppingListId).lean();
            if (!shoppingList) {
                return res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            if (userId !== shoppingList.owner.id && !shoppingList.members.includes(userId)) {
                res.status(403).send({error: `user with id '${userId}' is not allowed to modify members of this shopping list'`});
            }

            const valid = ajv.validate(shoppingListUpdateMembersSchema, req.body);
            if (valid) {
                // Update only the members field
                const updatedShoppingList = await ShoppingList.findByIdAndUpdate(
                    shoppingListId,
                    { $set: { members: req.body.members } }, // assuming req.body.members is the updated members array
                    { new: true }
                ).lean();

                res.json(updatedShoppingList);
            } else {
                return res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async updateShoppingListItems(req, res) {
        const ajv = new Ajv();
        const shoppingListId = req.params.id;
        try {
            const userId = req.user.userEmail;
            const shoppingList = await ShoppingList.findById(shoppingListId).lean();
            if (!shoppingList) {
                return res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            if (userId !== shoppingList.owner.id && !shoppingList.members.includes(userId)) {
                res.status(403).send({error: `user with id '${userId}' is not allowed to modify items of this shopping list'`});
            }

            const valid = ajv.validate(shoppingListUpdateItemsSchema, req.body);
            if (valid) {
                // Update only the items field
                const updatedShoppingList = await ShoppingList.findByIdAndUpdate(
                    shoppingListId,
                    { $set: { items: req.body.items } }, // assuming req.body.items is the updated items array
                    { new: true }
                ).lean();

                res.json(updatedShoppingList);
            } else {
                return res.status(400).send({
                    errorMessage: "validation of input failed",
                    params: req.body,
                    reason: ajv.errors,
                });
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async deleteShoppingList(req, res) {
        const shoppingListId = req.params.id;
        try {
            const userId = req.user.userEmail;
            let shoppingList = await ShoppingList.findById(shoppingListId).lean();
            if (!shoppingList) {
                return res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            }
            if (userId !== shoppingList.owner.id) {
                res.status(403).send({error: `user with id '${userId}' is not allowed to access this shopping list'`});
            }
            shoppingList = await ShoppingList.findByIdAndDelete(shoppingListId).lean();
            if (!shoppingList) {
                return res.status(400).send({message: `shopping list with id '${shoppingListId}' doesn't exist`});
            } else {
                return res.status(200).json({message: "shopping list with id: " + shoppingListId + " was successfully deleted"});
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

}

module.exports = new ShoppingListService();