const app = require("./app.js");
const {connectDatabase} = require("./config/database.js");
const cloudinary = require("cloudinary").v2;


connectDatabase();
cloudinary.config({
    cloud_name: "dhfmeuwzc",
    api_key: 438631656435136,
    api_secret: "rk9bZXMIx61Z7luVBIh7jpwVNRY",
  });
  
  
app.listen(process.env.PORT,()=>{console.log(`server is listening on ${process.env.PORT}`);});