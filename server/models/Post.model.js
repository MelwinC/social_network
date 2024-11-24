import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import User from "./User.model.js";

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: "Post",
  }
);

Post.associate = (models) => {
  Post.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Post.hasMany(models.Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  });
};

export default Post;