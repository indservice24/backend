import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    name:{type:String, required:true},
    fathername:{type:String, required:true},
    email:{type:String, required:true , unique:true},
    otp:{type:String, required:true},
    password:{type:String, required:true},
    phone:{type:Number, required:true},
    altphone:{type:Number, required:true},
    address:{type:String, required:true},
    service:{type:Array, required:true},
    addharfront:{type:String, required:true},
    addharback:{type:String, required:true},
    photo:{type:String, required:true},
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const partnerModel = mongoose.models.partner || mongoose.model('partner' ,partnerSchema)

export default partnerModel;

// , {minimize:false}