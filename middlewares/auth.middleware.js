import jwt from 'jsonwebtoken';
import AppError from '../errors/app.error.js';
import ERROR_MESSAGES from '../errors/const.error.js';
import User from '../models/User.model.js';

const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const response = {
      error: "Access denied",
      message: "No token provided",
    };
    return res.sendStatus(401).json(response);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
    try {
      if(!userData) {
        throw new AppError(403, "Invalid token");
      }

      const user = await User.findByPk(userData.id);

      if(!user) {
        throw new AppError(404, "User not found");
      }

      if (err) {
        throw new AppError(403, "Invalid token");
      }
      
      req.user = user;
      console.log("user", user.id);
    } catch (error) {
      console.error("[AuthMiddleware.checkToken]", error);
      if(error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      } else {
        return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    }
    next();
  });
};

export default checkToken;