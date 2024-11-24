export const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
    user_id: ID!
  }

  type Comment {
    id: ID!
    title: String
    content: String!
    user_id: ID!
    post_id: ID!
  }

  type Query {
    getMyPosts: [Post]
    getFriendsPosts: [Post]
    getPostById(post_id: ID!): Post
    getComments(post_id: ID!): [Comment]
    getCommentById(comment_id: ID!): Comment
  }
`;