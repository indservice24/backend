import validator from "validator";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            return res.json({success: true, token})
        } else {
            return res.status(401).json({success: false, message: "Incorrect password"})
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success: false, message: "An error occurred during login"})
    }
}

// user signup
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // checking user already exists or not
        const exists = await userModel.findOne({email});
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
        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success: true, token})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Admin Login
const adminLogin = async (req, res) => {
    try {
      const {email,password} = req.body
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(email+password,process.env.JWT_SECRET);
        res.json({success:true,token})
    }
    else{
        res.json({success:false,message:"Invalid Password"})
    }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export { loginUser, signupUser, adminLogin };
