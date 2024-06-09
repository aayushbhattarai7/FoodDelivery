const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const { route } = require('./routes/userRoute');
const { router } = require('./routes/uploadAdmin');
const User = require('./models/userModel')

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/User")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => console.error(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static( 'uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use("/", route);
app.use('/', router);




app.listen(PORT, () => {
    console.log(`Listening in port: ${PORT}`);
});
