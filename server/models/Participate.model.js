import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import Conversation from "./Conversation.model.js";
import User from "./User.model.js";

class Participate extends Model {}

Participate.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Conversation,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  },
  {
    sequelize,
    modelName: "Participate",
  }
);

Participate.associate = (models) => {
  Participate.belongsTo(models.User, {
    as: 'user',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Participate.belongsTo(models.Conversation, {
    as: 'conversation',
    foreignKey: 'conversation_id',
    onDelete: 'CASCADE',
  });
};

export default Participate;