import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import User from "./User.model.js";

class Follow extends Model {}

Follow.init(
  {
    follower_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    followed_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  },
  {
    sequelize,
    modelName: "Follow",
  }
);

Follow.associate = (models) => {
  Follow.belongsTo(models.User, {
    as: 'followerUser',
    foreignKey: 'follower_user_id',
    onDelete: 'CASCADE',
  });
  Follow.belongsTo(models.User, {
    as: 'followedUser',
    foreignKey: 'followed_user_id',
    onDelete: 'CASCADE',
  });
};
export default Follow;