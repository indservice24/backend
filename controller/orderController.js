import expressAsyncHandler from 'express-async-handler';
import orderModel from '../model/orderModel.js';
import userModel from '../model/userModel.js';
import nodemailer from 'nodemailer';
import partnerModel from "../model/partnerModel.js";


const addorder = async (req, res) => {
    try {
        const { name, number, servicename, servicedetail, state, city, address ,date,time,status,partnerAssigned } = req.body
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
            date,
            time,
            status,
            partnerAssigned,
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
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td>
                <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background-color: #4CAF50; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0;">INDIA SERVICE 24</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #4CAF50; margin-top: 0;">Service Assigned to you</h2>
                            <p>Dear Partner,</p>
                            <p>We are pleased to inform you that service assign to you.</p>
                            <p>Please check your portal for service detail/p>
                            
                            <p>If you have any questions or concerns about the service, please don't hesitate to contact our customer support team.</p>
                            <p>Thank you for choosing 24 Appliances Repair. We appreciate your trust in our services.</p>
                            <p>Best regards,<br>The 24 Appliances Repair Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666;">
                            <p>&copy; 2023 24 Appliances Repair. All rights reserved.</p>
                            <p>123 Repair Street, Mumbai, Maharashtra 400001, India</p>
                            <p>
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Website</a> |
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Contact Us</a> |
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
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

      await EmailToPartner(partnerEmail );
      res.status(200).json({ success: true, message: 'Order assigned to partner', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  



  // complete order 
  const completeOrder = async (req, res) => {
    const { orderId ,amount,chargedItem } = req.body;
    try {
      if (!orderId || !amount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { 
          status: 'completed',
          updatedAt: new Date(),
          amount,
          chargedItem
        },
        { new: true }
      );

      
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      order.save();
      res.status(200).json({ success: true, message: 'Order completed', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }


  // cancellate order 
  const cancelOrder = async (req, res) => {
    const { orderId ,cancelledNote } = req.body;
    try {
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { 
          status: 'cancelled',
          updatedAt: new Date(),
          cancelledNote
        },
        { new: true }
      );
      order.save();
      res.status(200).json({ success: true, message: 'Order cancelled', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }     


export {addorder,listorder,assignOrderToPartner,completeOrder,cancelOrder}