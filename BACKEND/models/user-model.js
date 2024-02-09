// import mongoose, { Schema } from "mongoose";
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UserSchema = new Schema({
    email:{
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
        unique: false
    }
  });

module.exports = mongoose.model("User", UserSchema)