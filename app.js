const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const auth = require("./auth");

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const shoppingListRouter = require("./controller/shoppingList-controller");
const userRouter = require("./controller/user-controller");

const mongoDB = "mongodb+srv://admin:mongoDBpassword123@cluster0.7uf9mne.mongodb.net/ShoppingList?retryWrites=true&w=majority";
mongoose.connect(mongoDB)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/shoppingList", auth, shoppingListRouter);
app.use("/users", userRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port localhost:${port}`);
});
