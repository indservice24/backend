import express from "express"
import { adminbymain, adminLogin, loginUser, signupUser } from "../controller/userController.js"


const userRouter = express.Router();

userRouter.post("/signup", signupUser)
userRouter.post("/login", loginUser)
userRouter.post("/adminlogin", adminLogin)
userRouter.post("/adminotp", adminbymain)


export default userRouter;
