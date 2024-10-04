import expressAsyncHandler from 'express-async-handler';
import orderModel from '../model/orderModel.js';
import userModel from '../model/userModel.js';
import nodemailer from 'nodemailer';



const addorder = async (req, res) => {
    try {
        const { name, number, servicename, servicedetail, state, city, address } = req.body
        // Add input validation here
        if (!name || !number || !servicename || !state || !city || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        
        const orderData = {
            name,
            number,
            servicename,
            servicedetail,
            state,
            city,
            address,
            createdAt: new Date()
        }
        const order = new orderModel(orderData);
        await order.save()
        res.status(201).json({ success: true, message: "Order placed successfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


const listorder =  async (req,res) => {
    try {
        const order = await orderModel.find({});
        res.json({success:true, order})
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: "Internal server error"})
    }
}



// Move this to a separate config file
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const EmailToPartner = expressAsyncHandler( (partnerEmail) => {    
    try {
         transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: partnerEmail,
            subject: "Service Assigned",
            text: `A new service has been assigned to you.`,
            html: `<div style="background-color:#f8f8f8; width:100%; padding:20px; color:#01b050;">
                     <h1 style="color:black;">INDIA SERVICE 24</h1>
                     <p>A new service has been assigned to you.</p>
                   </div>`,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
});


// Assign service to partner
const assignOrderToPartner = async (req, res) => {
    const { orderId, partnerId, partnerEmail } = req.body;
  
    try {
      if (!orderId || !partnerId || !partnerEmail) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { partnerId, status: 'inprogress', partnerAssigned: 'assigned' },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      await EmailToPartner(partnerEmail);
      res.status(200).json({ success: true, message: 'Order assigned to partner', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  // complete order 
  const completeOrder = async (req, res) => {
    const { orderId ,amount } = req.body;
    try {
      if (!orderId || !amount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { 
          status: 'completed',
          updatedAt: new Date(),
          amount
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.status(200).json({ success: true, message: 'Order completed', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }


export {addorder,listorder,assignOrderToPartner,completeOrder}