import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize.js";

class Conversation extends Model {}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Conversation",
  }
);

Conversation.associate = (models) => {
  Conversation.hasMany(models.Message, {
    as: 'messages',
    foreignKey: 'conversation_id',
    onDelete: 'CASCADE',
  });
  Conversation.belongsToMany(models.User, {
    as: 'users',
    through: models.Participate,
    foreignKey: 'conversation_id',
    otherKey: 'user_id',
    onDelete: 'CASCADE',
  });
};

export default Conversation;