// import orderModel from "../model/orderModel.js";
// import userModel from "../model/userModel.js";



// // placing order on COD Method

// const placeOrder = async (req,res) => {
//     try {
//         const {userId,items,amount,address} = req.body;
//         const orderData = {
//             userId,
//             items,
//             amount,
//             address,
//             PaymentMethod:"COD",
//             payment:false,
//             date:Date.now()
//         }
//         const neworder = new orderModel(orderData)
//         await neworder.save()
//         await userModel.findByIdAndUpdate(userId,{carData:{}})
//         res.json({success:true, message:"order placed"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, essage:error.message})
//     }
// }

// // placing order using oline method

// const placeOrderOnline = async (req,res) => {

// }


// // all order for admin panel
// const allOrders = async (req,res) => {

// }


// // user order data for frontend
// const userOrders = async (req,res) => {

// }

// // update order status for admin panel
// const upadteOrderstatus = async (req,res) => {

// }



// export {placeOrder,placeOrderOnline ,allOrders ,userOrders, upadteOrderstatus}

