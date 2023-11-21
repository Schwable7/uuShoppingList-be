
const express = require("express");
const UserService = require("../service/user-service");
const router = express.Router();

router.post('/create', async (req, res) => {
    await UserService.createUser()
});

router.get('/get', async (req, res) => {
    await UserService.getAllUsers()
});

router.get('/:id/get', async (req, res) => {
    await UserService.getUser()
});

module.exports = router;