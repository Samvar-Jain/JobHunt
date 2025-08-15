const express = require("express");
const app = express()
const dbConnect = require("./config/dataBase");
const User = require("./models/userSchema");
const authRouter = require("./routes/authRouter");
const jobRouter = require("./routes/jobRouter");
const cookieparser = require('cookie-parser')

app.use(express.json());
app.use(cookieparser());

dbConnect()
.then(() => {
    console.log("database connected successfully");

    app.listen(777, () => {
        console.log("server is listening on port 777");
    });
})
.catch((error) => {
    console.log(error);
});

app.use("/",authRouter);
app.use("/",jobRouter);