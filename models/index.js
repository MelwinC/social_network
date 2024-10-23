// models/index.js
import sequelize from "../utils/sequelize.js";
import Comment from "./Comment.model.js";
import Follow from "./Follow.model.js";
import Post from "./Post.model.js";
import User from "./User.model.js";

// Define associations
User.associate({ Post, Comment, Follow });
Post.associate({ User, Comment });
Comment.associate({ User, Post });
Follow.associate({ User });

export { Comment, Follow, Post, User, sequelize };