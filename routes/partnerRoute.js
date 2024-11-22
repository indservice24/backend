import express from "express"
import {partnersignup, partnerlogin, main,listuser, addService, partnerDelete} from "../controller/partnerController.js"




const partnerRouter = express.Router();



partnerRouter.post("/partnersignup",partnersignup)
partnerRouter.post("/partnerlogin", partnerlogin)
partnerRouter.post("/send", main)
partnerRouter.get("/listuser", listuser)
partnerRouter.post("/addservice", addService)
partnerRouter.post("/partnerRemove", partnerDelete)


export default partnerRouter;