import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import User from "../models/User.model.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      throw new AppError(400, "Missing required fields");
    }

    // Email regex pattern
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    
    // Password regex pattern
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    const userExists = await User.findOne({ where: { mail } });
    
    if(userExists) {
      throw new AppError(400, "User already exists");
    }
    
    if (!emailRegex.test(mail)) {
      throw new AppError(400, "Invalid email");
    }

    if(!passwordRegex.test(password)) {
      throw new AppError(400, "Invalid password");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ mail, password: hashedPassword });

    const token = generateToken(user);

    const response = {
      message: "User successfully registered",
      token: `Bearer ${token}`,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("[AuthController.register]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      throw new AppError(400, "Missing required fields");
    }

    // Find the user by email
    const user = await User.findOne({ where: { mail } });

    if(!user) {
      throw new AppError(401, "Incorrect credentials");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Incorrect credentials");
    }

    const token = generateToken(user);

    const response = {
      message: "User successfully logged in",
      token: `Bearer ${token}`,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("[AuthController.login]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};


const generateToken = (user) => {
  return jwt.sign({ id: user.id, mail: user.mail }, process.env.JWT_SECRET, {
    expiresIn: 86400, // 24 hours
  });
}