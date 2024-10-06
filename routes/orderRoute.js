import express from "express"
import {addorder,listorder,assignOrderToPartner,completeOrder,cancelOrder} from "../controller/orderController.js"

const orderRouter = express.Router()

orderRouter.post('/add',addorder);
orderRouter.get('/list',listorder);
orderRouter.post('/assign',assignOrderToPartner);
orderRouter.post('/complete',completeOrder);
orderRouter.post('/cancel',cancelOrder);


export default orderRouter;