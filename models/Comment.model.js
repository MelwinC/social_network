import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import Post from "./Post.model.js";
import User from "./User.model.js";

class Comment extends Model {}
Comment.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: "Comment",
  }
);

export default Comment;