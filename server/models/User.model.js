import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    photo: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

User.associate = (models) => {
  User.hasMany(models.Post, {
    as: 'posts',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(models.Comment, {
    as: 'comments',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(models.Follow, {
    as: 'follows',
    foreignKey: 'follower_user_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(models.Follow, {
    as: 'followers',
    foreignKey: 'followed_user_id',
    onDelete: 'CASCADE',
  });
  User.belongsToMany(models.Conversation, {
    as: 'conversations',
    through: models.Participate,
    foreignKey: 'user_id',
    otherKey: 'conversation_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(models.Message, {
    as: 'messages',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
};

export default User;