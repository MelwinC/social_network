import jwt from "jsonwebtoken";
import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import User from "../models/User.model.js";

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "No token provided or token is invalid");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError(403, "Invalid token");
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[AuthMiddleware.checkToken]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

export default checkToken;
