import sequelize from "../utils/sequelize.js";
import Comment from "./Comment.model.js";
import Conversation from "./Conversation.model.js";
import Follow from "./Follow.model.js";
import Message from "./Message.model.js";
import Participate from "./Participate.model.js";
import Post from "./Post.model.js";
import User from "./User.model.js";

// Define associations
User.associate({ Post, Comment, Follow, Conversation, Participate, Message });
Post.associate({ User, Comment });
Comment.associate({ User, Post });
Follow.associate({ User });
Conversation.associate({ Message, User, Participate });
Message.associate({ Conversation, User });
Participate.associate({ User, Conversation });

export { Comment, Conversation, Follow, Message, Participate, Post, User, sequelize };
