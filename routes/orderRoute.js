import express from "express"
import {addorder,listorder,assignOrderToPartner,completeOrder} from "../controller/orderController.js"

const orderRouter = express.Router()

orderRouter.post('/add',addorder);
orderRouter.get('/list',listorder);
orderRouter.post('/assign',assignOrderToPartner);
orderRouter.post('/complete',completeOrder);


export default orderRouter;