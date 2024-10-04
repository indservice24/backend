import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, unique:true, lowercase:true, trim:true},
    password:{type:String, required:true},
    cartData:{type:Map, of:Number, default:()=>new Map()},
}, {timestamps:true});

// Index for faster queries
userSchema.index({email:1});

const userModel = mongoose.model('User', userSchema);

export default userModel;
