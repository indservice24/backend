import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
}, { timestamps: true });


const serviceModel = mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;
