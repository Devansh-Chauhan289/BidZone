
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import argon2 from "argon2"
import { userData } from "../models/user.model.js"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN 


// User Registration
const registerUser = async (req, res) => {
    const { name, email, password,  role } = req.body
    if (!name || !email || !password ) return res.status(400).json({ msg: "Enter all the details to complete sign-up." })

    try {
        const isRegistered = await userData.findOne({ email })
        if (isRegistered) return res.status(406).json({ msg: "email already registered." })

        const hashPassword = await argon2.hash(password)

        const newUser = await userData({
            name,
            email,
            password: hashPassword,
            
            role,
        })

        await newUser.save()

        return res.status(201).json({ msg: "User Registered Successfully!", newUser })
    } catch (err) {
        return res.status(500).json({ msg: "Error registerUser", error: err.message })
    }
}

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: "Insufficient Credentials." })

    try {
        const user = await userData.findOne({ email })
        if (!user) return res.status(404).json({ msg: "User NOT FOUND!" })

        const verifyPass = await argon2.verify(user.password, password)
        if (!verifyPass) return res.status(401).json({ msg: "Password does not match." })

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "6h" })
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        user.accessToken = accessToken
        user.refreshToken = refreshToken
        user.refreshTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await user.save()

        return res.status(200).json({ msg: "User Logged-In Successfully!", accessToken, refreshToken })
    } catch (err) {
        return res.status(500).json({ msg: "Error loginUser", error: err.message })
    }
}


// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const useremail = req.params.email;
        // const user = await userData.findOne({ email: useremail });
        
        // Find the user and populate the products field
        const user = await userData.findOne({ email: useremail }).populate("products");
        console.log("User before populate:", user);
        if (!user) return res.status(404).json({ msg: "User not found" });

        console.log("User profile:", user);
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({ msg: "Error fetching user profile", error: err.message });
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile
}