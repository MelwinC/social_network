import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";

class Follow extends Model {/*...*/}

Follow.init(
  {
    follower_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    followed_user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "Follow",
  }
);

export default Follow;