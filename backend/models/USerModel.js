const mongoose = require("mongoose");

const newUser = new mongoose.Schema({
    googleId : {type : String, unique : true, sparse: true},
    username : {type : String, unique : true},
    email : {type : String, unique : true,index : true},
    password : String,
    ProfilePic : String,
    createdAt : {type:Date, default:Date.now}
},{collection : "ContestPlatform"});

module.exports = mongoose.model("students",newUser);