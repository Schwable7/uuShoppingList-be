const shoppingListCreateSchema = {
    type: "object",
    properties: {
        userId: {type: "string", minLength: 1},
        name: {type: "string", minLength: 1},
        members: {type: "array", items: {type: "object", minLength: 1}},
        items: {type: "array", items: {type: "object"}},
        archived: {type: "boolean"},
    }
};

const shoppingListUpdateSchema = {
    type: "object",
    properties: {
        name: {type: "string", minLength: 1},
        members: {type: "array", items: {type: "object", minLength: 1}},
        items: {type: "array", items: {type: "object"}},
        archived: {type: "boolean"},
    }
};

const shoppingListAddItemSchema = {
    type: "object",
    properties: {
        item: {type: "object", minLength: 1},
    }
};

const shoppingListRemoveItemSchema = {
    type: "object",
    properties: {
        itemId: {type: "string", minLength: 1},
    }
};

const shoppingListUpdateItemSchema = {
    type: "object",
    properties: {
        itemId: {type: "string", minLength: 1},
        item: {type: "object", minLength: 1},
    }
};

const shoppingListAddMemberSchema = {
    type: "object",
    properties: {
        member: {type: "object", minLength: 1},
    }
};

const shoppingListRemoveMemberSchema = {
    type: "object",
    properties: {
        memberId: {type: "string", minLength: 1},
    }
};


module.exports = {
    shoppingListCreateSchema,
    shoppingListUpdateSchema,
    shoppingListAddItemSchema,
    shoppingListRemoveItemSchema,
    shoppingListUpdateItemSchema,
    shoppingListAddMemberSchema,
    shoppingListRemoveMemberSchema,
}