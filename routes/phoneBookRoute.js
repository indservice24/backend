import express from "express";
import { bookedPhone, phoneBook } from "../controller/phoneBookController.js";


const phoneBookRouter = express.Router()

phoneBookRouter.post('/book',phoneBook)
phoneBookRouter.get('/booklist',bookedPhone)


export default phoneBookRouter;