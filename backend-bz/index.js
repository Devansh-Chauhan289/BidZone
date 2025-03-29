import mongoose from "mongoose";
import express,{urlencoded} from "express";
import dotenv from "dotenv";
import session from "express-session"
import { userRouter } from "./src/routers/user.router.js";
import passport from "passport";

dotenv.config();

const PORT = process.env.PORT || 3300;
const DB_URL = process.env.DB_URL

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())


app.use("/",userRouter)
app.use("/product",productRouter)


app.listen(PORT, async () => {
    try {
        await mongoose.connect(DB_URL);
        
        console.log("Connected to Database");
        console.log(`Server is running on port http://localhost:${PORT}`);
    } catch (error) {
        console.error("Error occurred while connecting to the database:", error.message);
        process.exit(1); 
    }
});