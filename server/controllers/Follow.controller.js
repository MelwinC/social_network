import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Follow from "../models/Follow.model.js";
import User from "../models/User.model.js";

// Follow someone
export const addFollow = async (req, res) => {
  try {
    const { followed_user_id } = req.body;
    const follower_user_id = req.user.id;

    if(follower_user_id === followed_user_id){
      throw new AppError(400, "You can't follow yourself");
    }

    if (!followed_user_id) {
      throw new AppError(400, "Missing required fields");
    }

    const followExists = await Follow.findOne({
      where: { follower_user_id, followed_user_id },
    });

    if(followExists){
      throw new AppError(400, "You already follow this user");
    }

    const user = await User.findByPk(followed_user_id);

    if(!user){
      throw new AppError(404, "User not found");
    }

    const newFollow = await Follow.create({
      follower_user_id,
      followed_user_id,
    });

    res.status(201).json(newFollow);
  } catch (error) {
    console.error("[FollowController.addFollow]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get all my follows
export const getFollows = async (req, res) => {
  try {
    const { id } = req.user;

    const follows = await Follow.findAll({
      where: { follower_user_id: id },
      include: [
        {
          model: User,
          as: 'followedUser',
          attributes: ['id', 'firstname', 'lastname', 'photo'],
        },
      ],
    });

    const followedUsers = follows.map(follow => follow.followedUser);

    res.status(200).json(followedUsers);
  } catch (error) {
    console.error("[FollowController.getFollows]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get all my followers
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.user;

    const followers = await Follow.findAll({
      where: { followed_user_id: id },
    });

    res.status(200).json(followers);
  } catch (error) {
    console.error("[FollowController.getFollowers]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}

// Get a specified follow by id
export const getFollowById = async (req, res) => {
  try {
    const { follower_user_id, followed_user_id } = req.params;

    const follow = await Follow.findOne({
      where: { follower_user_id, followed_user_id },
    });

    if (!follow) {
      throw new AppError(404, "Follow not found");
    }
    
    res.status(200).json(follow);
  } catch (error) {
    console.error("[FollowController.getFollowById]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Unfollow a user by its id
export const deleteFollow = async (req, res) => {
  try {
    const { followed_user_id } = req.params;
    const follower_user_id = req.user.id;
    
    const follow = await Follow.findOne({
      where: { follower_user_id, followed_user_id },
    });

    if(!follow){
      throw new AppError(404, "You don't follow this user");
    }

    await follow.destroy();

    res.status(204).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("[FollowController.deleteFollow]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};
