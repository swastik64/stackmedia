const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require('cors');
const path = require('path');


app.use(cors({ credentials: true, origin: 'https://stackmedia.vercel.app/' }));

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
app.use(express.static(path.join(__dirname, '../frontend/myapp/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/myapp/build/index.html"));
});
module.exports = app;
