import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./src/routers/user.router";

dotenv.config();

const PORT = process.env.PORT || 3300;
const DB_URL = process.env.DB_URL

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))


app.use("/",userRouter)


app.listen(PORT, async () => {
    try {
        await mongoose.connect(DB_URL);
        
        console.log("Connected to Database");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error occurred while connecting to the database:", error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
});