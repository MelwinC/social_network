import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

// Add user details
export const usersDetails = async (req, res) => {
  try {
    const { firstname, lastname } = req.body;
    const photo = req.file;

    if (!firstname || !lastname || !photo) {
      throw new AppError(400, "Missing required fields");
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.photo = photo.path;

    // Update the user details
    await user.save();

    const response = {
      message: "User details successfully updated",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        photo: user.photo,
        mail: user.mail,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("[UserController.usersDetails]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Read all users
export const getUsers = async (_, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "photo", "firstname", "lastname"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("[UserController.getUsers]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Read user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "photo", "firstname", "lastname"],
    });

    if(!user){
      throw new AppError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("[UserController.getUserById]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { user } = req;

    if(!user){
      throw new AppError(404, "User not found");
    }

    await user.destroy();

    res.status(204).json();
  } catch (error) {
    console.error("[UserController.deleteUser]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};
