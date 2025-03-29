import { forgotPassword, resetPassword } from "../controllers/forget.controller.js"
import {registerUser, loginUser, getUserProfile} from "../controllers/user.controller.js"
import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const userRouter = express.Router()


userRouter.post("/user/register", registerUser)
userRouter.post("/user/login", loginUser)
userRouter.get("/user/profile/:email", authMiddleware, getUserProfile)


//Forget and Reset Password Routes
userRouter.post("/user/forget-password", forgotPassword)
userRouter.post("/user/reset-password/:token", resetPassword)


export {
    userRouter
}