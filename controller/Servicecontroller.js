import { v2 as cloudinary } from 'cloudinary';
import serviceModel from '../model/serviceModel.js';

// function for add service

const addService =  async (req,res) => {
    try {
        const{name,description,price,category} = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

        // const imageUrl = await Promise.all(
        //     images.map(async (item) => {
        //         let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
        //         return result.secure_url
        //     })
        // )
        const serviceData = {
            name,
            description,
            price:Number(price),
            category
        }
        const service = new serviceModel(serviceData);
        await service.save()

        res.json({success:true,message:"service add"})
        console.log(serviceData);

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
    await serviceModel.findByIdAndDelete(req.body.id)
    res.json({success:true,message:"Service deleted"})
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
        res.json({success:true,service})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {addService,listService,singleService,removeService}
