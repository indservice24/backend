import serviceModel from '../model/serviceModel.js';
import fs from 'fs'



// function for add service

const addService =  async (req,res) => {
    
    
    try {
        
        const {name , image ,price , description,category} = req.body
        const services =  {
            name,
            image,
            price,
            description,
            category
        }
        const service = new serviceModel(services);
        await service.save()

        res.json({success:true,message:"service add"})
        // console.log(serviceData);

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for list service

const listService =  async (req,res) => {
    try {
        const service = await serviceModel.find({});
        res.json({success:true,service})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for remove service

const removeService =  async (req,res) => {
try {
    // fs.unlink(`uploads/${service.image}`, ()=>{})
    // await serviceModel.findByIdAndDelete(req.body.id)
    // res.json({success:true,message:"Service deleted"})

    // const service = await serviceModel.findById(req.body.id);
    // fs.unlink(`upload/${service.image}`, ()=>{})
    // await serviceModel.findByIdAndDelete(req.body.id);
    // res.json({succes:true,message:"service Remove"})

    // Find the service by ID
    const service = await serviceModel.findById(req.body.id);
    
    if (!service) {
        return res.json({ success: false, message: "Service not found" });
    }

    // Delete the image file if it exists
    if (service.image) {
        const imagePath = `upload/${service.image}`;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
            }
        });
    }

    // Delete the service from the database
    await serviceModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Service deleted successfully" });

} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
}

}

// function for single service info

const singleService =  async (req,res) => {
    try {
        const {serviceId} = req.body
        const service = await serviceModel.findById(serviceId)
        res.json({success:true,message:"service deleted"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {addService,listService,singleService,removeService}
