const express = require("express");
const mongoose = require("mongoose");
require('dotenv/config')
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const router = require("./src/routes/router")
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(router);

app.get('/',(req, res)=>{
    res.send("dsfgdsfgdsg")
})

app.listen(process.env.PORT, () => {
    console.log(`Nodejs with Express started in PORT ${process.env.PORT}!!!`);
    mongoose.connect(process.env.DB_URL, { dbName: 'HouseRent', useNewUrlParser: true, useUnifiedTopology: true, })
        .then(() => {
            console.log(`DB CONNECTED SUCCESFULLY`)
        })
        .catch(() => {
            console.log("Error in Database Connection")
        })
})
