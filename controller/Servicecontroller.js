import serviceModel from '../model/serviceModel.js';
import fs from 'fs/promises';
import path from 'path';

// Function for adding a service
const addService = async (req, res) => {
    try {
        const { name, image, price, description, category } = req.body;

        if (!name || !image || !price || !description || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newService = new serviceModel({
            name,
            image,
            price,
            description,
            category
        });

        await newService.save();
        res.status(201).json({ success: true, message: "Service added successfully" , service:newService});
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function for listing services
const listService = async (req, res) => {
    try {
        const service = await serviceModel.find({});
        res.status(200).json({ success: true, service });
    } catch (error) {
        console.error("Error listing services:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function for removing a service
const removeService = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Service ID is required" });
        }

        const service = await serviceModel.findById(id);
        
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Delete the image file if it exists
        if (service.image) {
            const imagePath = path.join(process.cwd(), 'upload', service.image);
            await fs.unlink(imagePath).catch(err => console.error("Error deleting image file:", err));
        }

        // Delete the service from the database
        await serviceModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error removing service:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Function for getting single service info
const singleService = async (req, res) => {
    try {
        const { serviceId } = req.body;

        if (!serviceId) {
            return res.status(400).json({ success: false, message: "Service ID is required" });
        }

        const service = await serviceModel.findById(serviceId);
        
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        
        res.status(200).json({ success: true, service });
    } catch (error) {
        console.error("Error fetching single service:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addService, listService, singleService, removeService };
