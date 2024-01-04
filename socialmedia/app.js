const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require('cors');


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

require("dotenv").config({ path: "./config/config.env" });
const errorhandler = require("./middleware/error.js");
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const postroute = require("./routes/postroute.js");
const userroute = require("./routes/userroute.js");

app.use("/api/v1", postroute);
app.use("/api/v1", userroute);

app.use(errorhandler);
module.exports = app;
