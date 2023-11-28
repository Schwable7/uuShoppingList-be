const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");



class UserService {
    async createUser(request, response) {
        bcrypt
            .hash(request.body.password, 10)
            .then((hashedPassword) => {
                const user = new User({
                    email: request.body.email,
                    name: request.body.name,
                    password: hashedPassword,
                });
                user.save()
                    .then((result) => {
                        response.status(201).send({
                            message: "User Created Successfully",
                            result,
                        });
                    })
                    .catch((error) => {
                        response.status(500).send({
                            message: "Error creating user",
                            error,
                        });
                    });
            })
            .catch((e) => {
                response.status(500).send({
                    message: "Password was not hashed successfully",
                    e,
                });
            });
    }

    async login(request, response) {
        User.findOne({ email: request.body.email })
            .then((user) => {
                bcrypt
                    .compare(request.body.password, user.password)
                    .then((passwordCheck) => {
                        if(!passwordCheck) {
                            return response.status(400).send({
                                message: "Passwords does not match",
                                error,
                            });
                        }
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                userEmail: user.email,
                            },
                            "RANDOM-TOKEN",
                            { expiresIn: "24h" }
                        );
                        response.status(200).send({
                            message: "Login Successful",
                            email: user.email,
                            token,
                        });
                    })
                    .catch((error) => {
                        response.status(400).send({
                            message: "Passwords does not match",
                            error,
                        });
                    });
            })
            .catch((e) => {
                response.status(404).send({
                    message: "Email not found",
                    e,
                });
            });
    }
    async getUser() {
        //TODO
    }

    async getAllUsers() {
        //TODO
    }
}

module.exports = new UserService();