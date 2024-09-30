import express from "express"
import { addService, listService, removeService, singleService } from "../controller/Servicecontroller.js"
import adminAuth from "../middleware/adminAuth.js";
import multer from "multer";


const serviceRouter = express.Router()

const storage = multer.diskStorage({
    destination:"upload",
    filename: function(req,file,cb){
        return cb(null,`${Date.now()}${file.originalname}`)
        // return cb(null,Date.now()+(file.originalname));
    }
})

const upload = multer({storage:storage})

serviceRouter.post("/add",upload.single("image"),addService);
serviceRouter.post('/remove', adminAuth,removeService);
serviceRouter.post('/single',singleService);
serviceRouter.get('/list',listService);

export default serviceRouter;
