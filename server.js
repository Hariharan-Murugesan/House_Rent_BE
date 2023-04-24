const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Router = require("./src/routes/router")

const app = express();

app.use(cors);
app.use(express.json());

app.use('/app', Router);

app.listen(process.env.PORT, () => {
    console.log(`Nodejs with Express started in PORT ${process.env.PORT}!!!`);
    mongoose.connect(process.env.DB_URL, { dbName: 'MyFirstDb', useNewUrlParser: true, useUnifiedTopology: true, })
        .then(() => {
            console.log(`DB CONNECTED SUCCESFULLY`)
        })
        .catch(() => {
            console.log("Error in Database Connection")
        })
})
