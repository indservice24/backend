import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },

    height: { type: Number, required: true },
    width: { type: Number, required: true },
    weight: {
        type: Number,  // in grams
        required: true
    },

    displayType: {
        type: String,  // e.g., OLED, LCD, etc.
        required: true
    },
    displaySize: {
        type: Number,  // in inches
        required: true
    },

    displayResolutionWidth: { type: Number, required: true },  // in pixels
    displayResolutionHeight: { type: Number, required: true },


    processorBrand: { type: String, required: true },
    processorModel: { type: String, required: true }, // in GHz

    ram: {
        type: Number,  // in GB
        required: true
    },
    storage: {
        type: Number,  // in GB
        required: true
    },
    rearcamera: { type: String, required: true },
    frontcamera: { type: String, required: true },
    batteryCapacity: { type: Number, required: true },  // in mAh
    fastCharging: { type: Boolean, default: false },
    wirelessCharging: { type: Boolean, default: false },

    os: {
        type: String,
        required: true
    },
    wifi: { type: String, required: true },  // e.g., Wi-Fi 6
    Network: { type: String, required: true },  
    bluetooth: { type: String, required: true },  // e.g., 5.0, 5.2
    nfc: { type: Boolean, default: false },
    usbType: { type: String, required: true },  // e.g., Type-C,
    price: {
        type: Number,  // in the local currency
        required: true
    },
    availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: "In Stock" },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const phoneModel = mongoose.models.phone || mongoose.model('Smartphone', phoneSchema);

export default phoneModel;