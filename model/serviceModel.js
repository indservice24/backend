import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
}, { timestamps: true });

// Compound index for faster queries on name and category
serviceSchema.index({ name: 1, category: 1 });

// Virtual for formatted price (assuming price is stored as a string)
serviceSchema.virtual('formattedPrice').get(function() {
    return `$${parseFloat(this.price).toFixed(2)}`;
});

const serviceModel = mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;
