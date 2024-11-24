import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import Post from "./Post.model.js";
import User from "./User.model.js";

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      },
      onDelete: 'CASCADE'
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: "Comment",
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Comment.belongsTo(models.Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  });
};

export default Comment;