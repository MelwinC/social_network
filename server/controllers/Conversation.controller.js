import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Conversation from "../models/Conversation.model.js";
import Follow from "../models/Follow.model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { Sequelize } from "sequelize";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { name, userIds } = req.body;

    if (!userIds) {
      throw new AppError(400, "UserIds are required");
    }

    const user = req.user;

    // Fetch follow relationships where the current user is the follower
    const follows = await Follow.findAll({
      where: {
        follower_user_id: user.id,
        followed_user_id: userIds,
      },
    });

    // Fetch follow relationships where the current user is the followed user
    const followers = await Follow.findAll({
      where: {
        follower_user_id: userIds,
        followed_user_id: user.id,
      },
    });

    // Check if the current user follows all the users in userIds
    const followedUserIds = follows.map(follow => follow.followed_user_id);
    const notFollowedUserIds = userIds.filter(id => !followedUserIds.includes(id));

    if (notFollowedUserIds.length > 0) {
      throw new AppError(400, "You must follow all users you are trying to add");
    }

    // Check if all the users in userIds follow the current user
    const followerUserIds = followers.map(follow => follow.follower_user_id);
    const notFollowerUserIds = userIds.filter(id => !followerUserIds.includes(id));

    if (notFollowerUserIds.length > 0) {
      throw new AppError(400, "All users you are trying to add must follow you");
    }

    const conversation = await Conversation.create({ name: name || '' });
    const test = [...userIds, user.id];
    await conversation.addUsers([...userIds, user.id]);
    res.status(201).json(conversation);
  } catch (error) {
    console.error("[ConversationController.createConversation]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get my conversations
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstname", "lastname", "photo"],
          through: { attributes: [] },
        },
        {
          model: Message,
          as: "messages",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstname", "lastname", "photo"],
            },
          ],
        },
      ],
      where: {
        id: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT conversation_id FROM Participates WHERE user_id = ${userId})`
          ),
        },
      },
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("[ConversationController.getMyConversations]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get conversation by ID
export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstname", "lastname", "photo"],
          through: { attributes: [] },
        },
        {
          model: Message,
          as: "messages",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstname", "lastname", "photo"],
            },
          ],
        },
      ],
    });

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    if (!conversation.users.map((user) => user.id).includes(req.user.id)) {
      throw new AppError(403, "You are not part of this conversation");
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("[ConversationController.getConversationById]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

export const addUsersToConversation = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds) {
      throw new AppError(400, "UserIds are required");
    }

    const conversation = await Conversation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "users",
          through: { attributes: [] },
        },
      ],
    });

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    const user = req.user;

    // Check if the current user is part of the conversation
    if (!conversation.users.map((u) => u.id).includes(user.id)) {
      throw new AppError(403, "You are not part of this conversation");
    }
    
    // Check if any of the users in userIds are already part of the conversation
    const existingUserIds = conversation.users.map((u) => u.id);
    const alreadyInConversation = userIds.filter(id => existingUserIds.includes(id));

    if (alreadyInConversation.length > 0) {
      throw new AppError(400, "Some users are already part of this conversation");
    }

    // Fetch follow relationships where the current user is the follower
    const follows = await Follow.findAll({
      where: {
        follower_user_id: user.id,
        followed_user_id: userIds,
      },
    });

    // Fetch follow relationships where the current user is the followed user
    const followers = await Follow.findAll({
      where: {
        follower_user_id: userIds,
        followed_user_id: user.id,
      },
    });

    // Check if the current user follows all the users in userIds
    const followedUserIds = follows.map(follow => follow.followed_user_id);
    const notFollowedUserIds = userIds.filter(id => !followedUserIds.includes(id));

    if (notFollowedUserIds.length > 0) {
      throw new AppError(400, "You must follow all users you are trying to add");
    }

    // Check if all the users in userIds follow the current user
    const followerUserIds = followers.map(follow => follow.follower_user_id);
    const notFollowerUserIds = userIds.filter(id => !followerUserIds.includes(id));

    if (notFollowerUserIds.length > 0) {
      throw new AppError(400, "All users you are trying to add must follow you");
    }

    await conversation.addUsers(userIds);

    res.status(200).json(conversation);
  } catch (error) {
    console.error("[ConversationController.addUsersToConversation]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}

export const leaveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "users",
          through: { attributes: [] },
        },
      ],
    });

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    const user = req.user;

    if (!conversation.users.map((user) => user.id).includes(user.id)) {
      throw new AppError(403, "You are not part of this conversation");
    }

    await conversation.removeUser(user.id);

    res.status(204).json();
  } catch (error) {
    console.error("[ConversationController.leaveConversation]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}
