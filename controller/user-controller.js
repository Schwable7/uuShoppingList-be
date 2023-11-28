
const express = require("express");
const UserService = require("../service/user-service");
const router = express.Router();

router.post('/register', async (req, res) => {
    await UserService.createUser(req, res)
});

router.post('/login', async (req, res) => {
    await UserService.login(req, res)
});

router.get('/get', async (req, res) => {
    await UserService.getAllUsers()
});

router.get('/:id/get', async (req, res) => {
    await UserService.getUser()
});

module.exports = router;