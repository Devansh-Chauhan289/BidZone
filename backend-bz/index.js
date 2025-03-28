import mongoose from "mongoose";
import express from "express"

const app = express()






app.listen(3000,()=>{
    try {
        mongoose.connect("mongodb://localhost:27017/BidZone")
        console.log("Connected to Database");
        console.log("Server is running on port 3000")
    } catch (error) {
        console.log("Error occured", error);
    }
    
})