import validator from "validator";
import userModel from "../model/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import generateOtp from "../middleware/genrateOtp.js";
import expressAsyncHandler from 'express-async-handler'


const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};


global.store = {OTP:null};




// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {

        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return handleError(res, 401, "Invalid email or password");
        }
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"})
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            return res.json({success: true, token,user})
        } else {
            return res.status(401).json({success: false, message: "Incorrect password"})
        }
        res.json({ success: true, token, user });
    } catch (error) {
        handleError(res, 500, "An error occurred during login");
    }
}

// user signup
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        if (!validator.isEmail(email)) {
            return res.status(401).json({success: false, message: "Please enter a valid email"})
        }
        if (password.length < 8) {
             return res.status(401).json({success: false, message: "Please enter a strong password (at least 8 characters)"})
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
             return res.status(401).json({success: false, message: "User already exists"})
        }
        // hashing user password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const token = createToken(newUser._id);
        res.status(201).json({ success: true, token });
    } catch (error) {
       return res.status(401).json({success: false,})
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    const { email, password , otp } = req.body;
    
    try {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return handleError(res, 401, "Invalid credentials");
        }
        if (otp !==  global.store.OTP) {
            return res.json({success: false, message: "plase enter valide otp"})
         }

        const token = createToken(null, 'admin');
        res.json({ success: true, token });
    } catch (error) {
        return res.status(401).json({success: false })
    }
};



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "indservice24@gmail.com",
      pass: "emlzdtbcwtydvlip",
    },
  });

const adminbymain = expressAsyncHandler(async(req,res) => {
    const{email , password} = req.body;
    

    try {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const otp = generateOtp();
        const emails = email;
        console.log(emails);
        global.store.OTP = otp;
        console.log(global.store.OTP);
        const info = await transporter.sendMail({
            from: 'indservice24@gmail.com', // sender address
            to: `${emails}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `your otp is ${otp}`, // plain text body
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
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



export { loginUser, signupUser, adminLogin , adminbymain};
