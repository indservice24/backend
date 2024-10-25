import express from 'express';
import { addPhone, phonelist, removePhone, singlePhone, updateofStock, updateStock } from '../controller/phoneController.js';




const phoneRouter = express.Router()

phoneRouter.post('/add',addPhone)
phoneRouter.post('/remove',removePhone)
phoneRouter.post('/update',updateStock)
phoneRouter.post('/updateof',updateofStock)
phoneRouter.get('/list',phonelist)
phoneRouter.post('/single',singlePhone)

export default phoneRouter;