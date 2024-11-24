import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import Follow from "../models/Follow.model.js";

export const resolvers = {
  Query: {
    getMyPosts: async (_, __, { user }) => {
      try {
        const posts = await Post.findAll({ where: { user_id: user.id } });
        return posts;
      } catch (error) {
        console.error("[GraphQL.getMyPosts]", error);
        throw new Error("Failed to fetch my posts");
      }
    },
    getFriendsPosts: async (_, __, { user }) => {
      try {
        const user_id = user.id;

        const follows = await Follow.findAll({
          where: { follower_user_id: user_id },
        });
        
        const followedUserIds = follows.map(
          (follow) => follow.followed_user_id
        );

        const posts = await Post.findAll({
          where: { user_id: followedUserIds },
        });

        return posts;
      } catch (error) {
        console.error("[GraphQL.getFriendsPosts]", error);
        throw new Error("Failed to fetch my friends posts");
      }
    },
    getPostById: async (_, { post_id }, { user }) => {
      try {
        const user_id = user.id;

        const post = await Post.findByPk(post_id);

        if (post.user_id === user_id) {
          return post;
        }

        const follows = await Follow.findAll({
          where: { follower_user_id: user_id },
        });

        const followedUserIds = follows.map(
          (follow) => follow.followed_user_id
        );

        if (followedUserIds.includes(post.user_id)) {
          return post;
        }
      } catch (error) {
        console.error("[GraphQL.getPostById]", error);
        throw new Error("Failed to fetch post");
      }
    },
    getComments: async (_, { post_id }) => {
      try {
        const comments = await Comment.findAll({
          where: { post_id },
        });
        return comments;
      } catch (error) {
        console.error("[GraphQL.getComments]", error);
        throw new Error("Failed to fetch comments");
      }
    },
    getCommentById: async (_, { comment_id }) => {
      try {
        const comment = await Comment.findByPk(comment_id);
    
        if (!comment) {
          throw new Error("Comment not found");
        }
    
        return comment;
      } catch (error) {
        console.error("[GraphQL.getCommentById]", error);
        throw new Error("Failed to fetch comment");
      }
    },
  },
};