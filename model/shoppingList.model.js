const mongoose = require('mongoose');



const shoppingListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Object,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    items: {
        type: Array,
        required: true,
        default: []
    },
    archived: {
        type: Boolean,
        required: true,
        default: false
    }
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = ShoppingList;