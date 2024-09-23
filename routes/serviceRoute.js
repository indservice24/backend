import express from "express"
import { addService, listService, removeService, singleService } from "../controller/Servicecontroller.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const serviceRouter = express.Router()

serviceRouter.post('/add',adminAuth,upload.fields([{name:'image1', maxCount:1},{name:'image2', maxCount:1},{name:'image3', maxCount:1},{name:'image4', maxCount:1}]),addService);
serviceRouter.post('/remove', adminAuth,removeService);
serviceRouter.post('/single',singleService);
serviceRouter.get('/list',listService);

export default serviceRouter;
