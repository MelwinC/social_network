import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Comment from "../models/Comment.model.js";

// Add a comment on a post
export const addComment = async (req, res) => {
  try {
    const { title, content, post_id } = req.body;
    const user_id = req.user.id;
    
    if(!content) {
      throw new AppError(400, "Missing required fields");
    }

    const newComment = await Comment.create({ title, content, user_id, post_id });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("[CommentController.addComment]", error.message);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get all comments from a post
export const getCommentsFromPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const comments = await Comment.findAll({
      where: { post_id},
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("[CommentController.getCommentsFromPost]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get a single comment by Id
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id);

    if(!comment) {
      throw new AppError(404, "Comment not found");
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("[CommentController.getCommentById]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      throw new AppError(404, "Comment not found");
    } 

    await comment.destroy();
    
    res.status(204).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("[CommentController.deleteComment]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};