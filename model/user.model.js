const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },
    name: {
        type: String,
        required: [true, "Please provide a name!"],
        unique: false,
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
});

// Create Models
const User = mongoose.model('User', userSchema);
module.exports = User;