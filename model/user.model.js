const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
});

// Create Models
const User = mongoose.model('User', userSchema);
module.exports = User;