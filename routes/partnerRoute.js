import express from "express"
import {partnersignup, partnerlogin, main,listuser} from "../controller/partnerController.js"




const partnerRouter = express.Router();



partnerRouter.post("/partnersignup",partnersignup)
partnerRouter.post("/partnerlogin", partnerlogin)
partnerRouter.post("/send", main)
partnerRouter.get("/listuser", listuser)


export default partnerRouter;