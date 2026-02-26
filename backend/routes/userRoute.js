import express from "express"
import { loginUser,registeredUser } from "../controllers/userController.js"

const userRouter= express.Router()

userRouter.post("/register",registeredUser)
userRouter.post("/login",loginUser)

export default userRouter