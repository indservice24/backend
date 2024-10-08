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


const handleError = (res, statusCode, message) => {
    console.error(`Error: ${message}`);
    return res.status(statusCode).json({ success: false, message });
};

// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {

        const user = await userModel.findOne({ email });
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

        const token = createToken(user._id);
        user.password = undefined; // Remove password from response
        res.json({ success: true, token, user });
     
    
   }
    catch (error) {
        handleError(res, 500, "An error occurred during login");
    }
}

// user signup
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        if (!validator.isEmail(email)) {
            return handleError(res, 400, "Please enter a valid email");
        }
        if (password.length < 8) {
            return handleError(res, 400, "Please enter a strong password (at least 8 characters)");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return handleError(res, 409, "User already exists");
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
        handleError(res, 500, "An error occurred during signup");
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
        handleError(res, 500, "An error occurred during admin login");
    }
};



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "rupeshkw9334@gmail.com",
      pass: "fzxllavvltlcwkun",
    },
  });

const adminbymain = expressAsyncHandler(async(req,res) => {
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



export { loginUser, signupUser, adminLogin , adminbymain};
