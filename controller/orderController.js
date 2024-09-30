import expressAsyncHandler from 'express-async-handler';
import orderModel from '../model/orderModel.js';
import userModel from '../model/userModel.js';
import nodemailer from 'nodemailer';



const addorder = async (req, res) => {
    try {
        const { name, number, servicename, servicedetail, state, city, address } = req.body
        const orderData = {
            name,
            number,
            servicename,
            servicedetail,
            state,
            city,
            address,
            createdAt: new Date() // Add creation time
        }
        const order = new orderModel(orderData);
        await order.save()
        // await userModel.findByIdAndUpdate(userId)
        res.json({ success: true, message: "order placed" })
        console.log(orderData);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const listorder =  async (req,res) => {
    try {
        const order = await orderModel.find({});
        res.json({success:true,order})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "rupeshkw9334@gmail.com",
      pass: "fzxllavvltlcwkun",
    },
  });


  const EmailToPartner = expressAsyncHandler((partnerEmail) => {    
    const emails = partnerEmail;
    console.log(emails);
    try {
        const info =  transporter.sendMail({
            from: 'rupeshkw9334@gmail.com', // sender address
            to: `${emails}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `Service Assigned`, // plain text body
            html: `<div style="background-color:#f8f8f8; width:100%; height:200px;  padding:10px; color:#01b050;"> <p style="color:black; font-size:20px; font-weight:800">INDIA SERVICE 24</p>Hello world? service assigned</div>`, // html body
          });
    } catch (error) {
        console.log(error);
    }


})




// Assign service to partner
const assignOrderToPartner = async (req, res) => {
    const { orderId, partnerId, partnerEmail } = req.body;
  
    try {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { partnerId,status:'inprogress', partnerAssigned:'assigned' },
        { new: true }
      );

      EmailToPartner(partnerEmail);
      res.status(200).json({ message: 'Order assigned to partner', order });
    } catch (error) {
      res.status(500).json({ error: 'Error assigning order' });
    }
  };
  

  // complete order 
  const completeOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { 
          status: 'completed',
          updatedAt: new Date()
        },
        { new: true }
      );
      res.status(200).json({ message: 'Order completed', order });
    } catch (error) {
      res.status(500).json({ error: 'Error completing order' });
    }
  }


export {addorder,listorder,assignOrderToPartner,completeOrder}