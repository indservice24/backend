import mongoose from "mongoose";


const phoneBookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    phoneName: {type: String, required: true},
    phoneRam: {type: String, required: true},
    phoneStorage: {type: String, required: true},
    phoneColor: {type: String, required: true},
    pin: {type: String, required: true},
    houseno: {type: String, required: true},
    area: {type: String, required: true},   
     completedAt: { type: Date, default: Date.now },
})


const phoneBookModel = mongoose.models.book || mongoose.model('book', phoneBookSchema);

export default phoneBookModel;