const express = require('express');
const mongoose = require('mongoose');
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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/shoppingList", shoppingListRouter);
app.use("/users", userRouter);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port localhost:${port}`);
});
