import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import User from "./User.model.js";

class Post extends Model {}
Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    }
  },
  {
    sequelize,
    modelName: "Post",
  }
);

export default Post;