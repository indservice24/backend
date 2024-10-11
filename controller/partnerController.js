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
            html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td>
                <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background-color: #FF6B35; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0;">INDIA SERVICE 24</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #FF6B35; margin-top: 0;">Your One-Time Password (OTP)</h2>
                            <p>Dear Valued Customer,</p>
                            <p>Your OTP for verification is:</p>
                            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #FF6B35;">
                            ${otp}
                            </div>
                            <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
                            <p>If you didn't request this OTP, please ignore this email.</p>
                            <p>Thank you for choosing INDIA SERVICE 24.</p>
                            <p>Best regards,<br>The INDIA SERVICE 24 Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666;">
                            <p>Copyright © 2020, All Right Reserved INDIA SERVICE 24.</p>
                            <p>Plot No - 11, Khasra No - 36 Takrohi, Indira Nagar, Lucknow 226016</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>`, // html body
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
              showPassword:password,
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
        user.save()
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



//service add by partner

const addService = async (req,res) => {
    const {id, service} = req.body
    try {
        if (!id) {
            res.json({success: false, message: error.message})
        }

        const serviced = await partnerModel.findByIdAndUpdate(id, {service: service}, {new: true})
        res.json({success: true, serviced})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}





export { partnerlogin, partnersignup ,main ,listuser, addService};
