import validator from "validator";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const handleError = (res, statusCode, message) => {
    console.error(`Error: ${message}`);
    return res.status(statusCode).json({ success: false, message });
};

// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return handleError(res, 401, "Invalid email or password");
        }

        const token = createToken(user._id);
        user.password = undefined; // Remove password from response
        res.json({ success: true, token, user });
    } catch (error) {
        handleError(res, 500, "An error occurred during login");
    }
};

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
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
    const { email, password } = req.body;
    
    try {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return handleError(res, 401, "Invalid credentials");
        }

        const token = createToken(null, 'admin');
        res.json({ success: true, token });
    } catch (error) {
        handleError(res, 500, "An error occurred during admin login");
    }
};

export { loginUser, signupUser, adminLogin };
