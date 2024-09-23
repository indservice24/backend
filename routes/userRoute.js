import express from "express"
import { adminLogin, loginUser, signupUser } from "../controller/userController.js"


const userRouter = express.Router();

userRouter.post("/signup", signupUser)
userRouter.post("/login", loginUser)
userRouter.post("/adminlogin", adminLogin)


export default userRouter;
