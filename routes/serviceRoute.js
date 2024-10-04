import express from "express"
import { addService, listService, removeService, singleService } from "../controller/Servicecontroller.js"
import adminAuth from "../middleware/adminAuth.js";


const serviceRouter = express.Router()



serviceRouter.post("/add",addService);
serviceRouter.post('/remove',removeService);
serviceRouter.post('/single',singleService);
serviceRouter.get('/list',listService);

export default serviceRouter;
