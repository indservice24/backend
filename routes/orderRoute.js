import express from "express"
import {addorder,listorder,assignOrderToPartner,completeOrder,cancelOrder, removeService} from "../controller/orderController.js"

const orderRouter = express.Router()

orderRouter.post('/add',addorder);
orderRouter.get('/list',listorder);
orderRouter.post('/assign',assignOrderToPartner);
orderRouter.post('/complete',completeOrder);
orderRouter.post('/cancel',cancelOrder);
orderRouter.post('/remove',removeService);


export default orderRouter;