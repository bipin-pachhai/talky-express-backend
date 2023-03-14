const express = require("express");
const routes = require("./src/routes/routes.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });
const app = express();
const port = 3000 || process.env.PORT;
const connectionString = process.env.DB_URI;

app.use("/", routes);

const setupServer = async () => {
    try {
        console.log("Connecting to DATABASE instance......");
        await mongoose.connect(connectionString);
        console.log("Successfully connected to Database server");
    } catch (error) {
        console.log("Error connecting to Database server" + error);
    }

    //app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(
        cors({
            methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
            allowedHeaders: "*",
            origin: "*",
            cors: "*",
        })
    );
};

setupServer();

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});

module.exports = app;