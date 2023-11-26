const shoppingListCreateSchema = {
    type: "object",
    properties: {
        title: {type: "string", minLength: 1},
        owner: {type: "object"},
        members: {type: "array", items: {type: "object", minLength: 1}},
        items: {type: "array", items: {type: "object"}},
        archived: {type: "boolean"},
    },
    required: ["title", "owner", "members"]
};

const shoppingListUpdateSchema = {
    type: "object",
    properties: {
        title: {type: "string", minLength: 1},
        members: {type: "array", items: {type: "object", minLength: 1}},
        items: {type: "array", items: {type: "object"}},
        archived: {type: "boolean"},
    },
    required: ["title", "owner", "members", "archived"]
};


module.exports = {
    shoppingListCreateSchema,
    shoppingListUpdateSchema
}