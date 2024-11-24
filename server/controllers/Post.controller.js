import AppError from "../errors/app.error.js";
import ERROR_MESSAGES from "../errors/const.error.js";
import Follow from "../models/Follow.model.js";
import Post from "../models/Post.model.js";

// Add a post
export const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user_id = req.user.id;

    if(!title || !content) {
      throw new AppError(400, "Missing required fields");
    }

    const newPost = await Post.create({ title, content, user_id });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("[PostController.addPost]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get all my posts
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { user_id: req.user.id } });

    res.status(200).json(posts);
  } catch (error) {
    console.error("[PostController.getMyPosts]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

export const getFriendsPosts = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Find the Ids of the users that the authenticated user follows
    const follows = await Follow.findAll({
      where: { follower_user_id: user_id },
    });

    const followedUserIds = follows.map(follow => follow.followed_user_id);

    // Retrieve the posts created by these followed users
    const posts = await Post.findAll({
      where: { user_id: followedUserIds },
    });

    res.status(200).json(posts);

  } catch (error) {
    console.error("[PostController.getFriendsPosts]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Get a post by id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) {
      throw new AppError(404, "Post not found");
    }

    // Check if the post belongs to the user
    if (post.user_id === user_id) {
      return res.status(200).json(post);
    }

    // Check if the post belongs to one of the user's friends
    const follows = await Follow.findAll({
      where: { follower_user_id: user_id },
    });

    const followedUserIds = follows.map(follow => follow.followed_user_id);

    if (followedUserIds.includes(post.user_id)) {
      return res.status(200).json(post);
    }

    // If the post does not belong to the user or one of his friends
    throw new AppError(403, "Access denied");

  } catch (error) {
    console.error("[PostController.getPostById]", error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};

// Delete a post by id
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if(!post){
      throw new AppError(404, "Post not found");
    }

    if(req.user.id !== post.user_id){
      throw new AppError(403, "Access denied");
    }

    await post.destroy();

    res.status(204).json();
  } catch (error) {
    console.error("[PostController.deletePost]", error);
    if(error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
};
