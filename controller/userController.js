import validator from "validator";
import userModel from "../model/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};



// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await bcryptjs.compare(password, user.password))) {
             return res.status(401).json({success: false, message: "Please enter a valid email"})
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
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
    } catch (error) {
        return res.status(401).json({success: false, })
    }
};

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

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await userModel.create({
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
    const { email, password } = req.body;
    
    try {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
           return res.status(401).json({success: false, message: "Incorrect password"})
        }

        const token = createToken(null, 'admin');
        res.json({ success: true, token });
    } catch (error) {
        return res.status(401).json({success: false })
    }
};

export { loginUser, signupUser, adminLogin };
