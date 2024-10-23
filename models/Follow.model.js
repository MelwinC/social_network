import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";

class Follow extends Model {}

Follow.init(
  {
    follower_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    followed_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
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

export default Follow;