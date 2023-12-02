const shoppingListCreateSchema = {
    type: "object",
    properties: {
        title: {type: "string", minLength: 1},
        owner: {type: "object"},
        members: {type: "array", items: {type: "object", minLength: 1}},
        items: {type: "array", items: {type: "object"}},
        archived: {type: "boolean"},
    },
    additionalProperties: false,
    required: ["title", "owner", "members"]
};

const shoppingListUpdateSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 1 },
        archived: { type: "boolean" }
    },
    additionalProperties: false // This ensures no other properties are included in the object
};

const shoppingListUpdateMembersSchema = {
    type: "object",
    properties: {
        members: {type: "array", items: {type: "object", minLength: 1}},
    },
    additionalProperties: false,
    required: ["members"]
};

const shoppingListUpdateItemsSchema = {
    type: "object",
    properties: {
        items: {type: "array", items: {type: "object"}},
    },
    additionalProperties: false,
    required: ["items"]
};


module.exports = {
    shoppingListCreateSchema,
    shoppingListUpdateSchema,
    shoppingListUpdateItemsSchema,
    shoppingListUpdateMembersSchema
}