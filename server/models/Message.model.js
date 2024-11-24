import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";
import Conversation from "./Conversation.model.js";
import User from "./User.model.js";

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conversation,
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    modelName: "Message",
  }
);

Message.associate = (models) => {
  Message.belongsTo(models.Conversation, {
    as: 'conversation',
    foreignKey: 'conversation_id',
    onDelete: 'CASCADE',
  });
  Message.belongsTo(models.User, {
    as: 'user',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
};

export default Message;