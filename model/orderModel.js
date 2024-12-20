import mongoose from "mongoose";



    const serviceCharges = new mongoose.Schema({
        id: {type:Number},
        chargedService: {type:String},
        charged: {type:Number},
        notes: {type:String}
    })


const orderSchema = new mongoose.Schema({
    name:{type:String, required:true},
    number:{type:Number, required:true},
    servicename:{type:String, required:true},
    servicedetail:{type:String, required:true},
    state:{type:String, required:true},
    city:{type:String, required:true},
    address:{type:String, required:true},
    partnerEmail:{type:String},
    date:{type:String},
    time:{type:String},
    amount:{type:Number},
    partnerAssigned:{type:String,  enum :['not assigned','assigned'], default:"not assigned"},
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    chargedItem: [serviceCharges],
    partnerName: {type:String},
    partnerNumber: {type:String},
    cancelledNote: {type:String},
    term: {type:String},
    status: { type: String, enum: ['completed','cancelled','inprogress'], default: 'inprogress' },
    completedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const orderModel = mongoose.models.order || mongoose.model("order" ,orderSchema)


export default orderModel;