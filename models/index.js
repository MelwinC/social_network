import sequelize from "../utils/sequelize.js";
import Comment from "./Comment.model.js";
import Follow from "./Follow.model.js";
import Post from "./Post.model.js";
import User from "./User.model.js";

// Define associations
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Comment, { foreignKey: "user_id" });
Post.hasMany(Comment, { foreignKey: "post_id" });

Comment.belongsTo(User, { foreignKey: "user_id" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'following_user_id', otherKey: 'followed_user_id' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followed_user_id', otherKey: 'following_user_id' });

export { Comment, Follow, Post, User, sequelize };
