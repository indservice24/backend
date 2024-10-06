import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true, trim: true },
    service: { type: [String], required: true },
    addharfront: { type: String, required: true },
    addharback: { type: String, required: true },
    photo: { type: String, required: true },
}, { timestamps: true });

// Compound index for faster queries
partnerSchema.index({ email: 1, phone: 1 });



const PartnerModel = mongoose.models.partner || mongoose.model('partner', partnerSchema);

export default PartnerModel;
