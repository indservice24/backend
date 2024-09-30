import express from "express"
import { addContact, listcontact } from "../controller/contactController.js"


const contactRouter = express.Router()

contactRouter.post('/add',addContact)
contactRouter.get('/list',listcontact)

export default contactRouter;
