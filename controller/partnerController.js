import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import partnerModel from "../model/partnerModel.js";
import nodemailer from 'nodemailer'
import generateOtp from "../middleware/genrateOtp.js";
import expressAsyncHandler from 'express-async-handler'



const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

global.store = {OTP:null};

// partner user login
const partnerlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await partnerModel.findOne({email});
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            return res.json({success: true, token,user})
        } else {
            return res.json({success: false, message: "Incorrect password"})
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success: false, message: "An error occurred during login"})
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


//   async function main() {

//     // const {email} =req.body

//     const otp = generateOtp()

//     global.store.OTP = otp;
//     console.log(global.store.OTP);
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: 'rupeshkw9334@gmail.com', // sender address
//       to: 'rupeshkw9334@gmail.com', // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: `your otp is ${otp}`, // plain text body
//       html: `your otp is ${otp}`, // html body
//     });
//   }



const main = expressAsyncHandler(async(req,res) => {
    const{email} = req.body;
    
    const otp = generateOtp();
    const emails = email;
    console.log(emails);
    global.store.OTP = otp;
    console.log(global.store.OTP);
    try {
        const info = await transporter.sendMail({
            from: 'rupeshkw9334@gmail.com', // sender address
            to: `${emails}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `your otp is ${otp}`, // plain text body
            html: `<div style="background-color:#f8f8f8; width:100%; height:200px;  padding:10px; color:#01b050;"> <p style="color:black; font-size:20px; font-weight:800">INDIA SERVICE 24</p>Hello world? ${otp}</div>`, // html body
          });
          res.json({success: true, message:"opt sended"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }


})


// partner  user signup
const partnersignup = async (req, res) => {


    try {

        const { name, email, password,phone,city,state,address,service,otp,addharfront, addharback,photo} = req.body;
        // checking user already exists or not
        const exists = await partnerModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: "User already exists"})
        }
        // email and password checking
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email"})
        }
        if (password.length < 8) {
            return res.json({success: false, message: "Please enter a strong password (at least 8 characters)"})
        }
         if (otp !==  global.store.OTP) {
            return res.json({success: false, message: "plase enter valide otp"})
         }
        // hashing user password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new partnerModel({
            name,
             email,
              password:hashedPassword,
              otp,
              phone,
              city,
              state,
              address,
              service,
              addharfront,
              addharback,
              photo
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success: true, token, user})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// lsit user

const listuser = async (req,res) => {
    try {
        const users = await partnerModel.find()
        res.json({success: true, users})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}



export { partnerlogin, partnersignup ,main ,listuser};
