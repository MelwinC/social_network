import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Message from "../models/Message.model.js";
import Participate from "../models/Participate.model.js";
import { wsServer } from "../index.js";

export const createMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;

    if (!content || !conversationId) {
      throw new AppError(400, "Content and conversationId are required");
    }

    const participation = await Participate.findOne({
      where: {
        user_id: req.user.id,
        conversation_id: conversationId,
      },
    });

    if (!participation) {
      throw new AppError(
        403,
        "You are not allowed to post a message in this conversation"
      );
    }

    const message = await Message.create({
      content,
      conversation_id: conversationId,
      user_id: req.user.id,
    });

    wsServer.emitMessage(conversationId, message);

    res.status(201).json(message);
  } catch (error) {
    console.error("[MessageController.createMessage]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

export const updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;
    
    if (!content || !messageId) {
      throw new AppError(400, "Content and messageId are required");
    }

    const message = await Message.findByPk(messageId);

    if (!message) {
      throw new AppError(404, "Message not found");
    }
    
    // Check if the current user is the owner of the message
    if (message.user_id !== req.user.id) {
      throw new AppError(403, "You are not allowed to update this message");
    }
    
    // Update the message content
    message.content = content;
    await message.save();
    
    res.status(200).json(message);
  } catch (error) {
    console.error("[MessageController.updateMessage]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if(!message){
      throw new AppError(404, "Message not found");
    }
    
    // Check if the current user is the owner of the message
    if (message.user_id !== req.user.id) {
      throw new AppError(403, "You are not allowed to delete this message");
    }

    await message.destroy();

    res.status(204).json();
  } catch (error) {
    console.error("[MessageController.deleteMessage]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};
