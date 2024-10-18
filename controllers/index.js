import express from "express";
import checkToken from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getCommentById, getCommentsFromPost } from "./Comment.controller.js";
import { addFollow, deleteFollow, getFollowById, getFollowers, getFollows } from "./Follow.controller.js";
import { addPost, deletePost, getFriendsPosts, getMyPosts, getPostById } from "./Post.controller.js";
import { deleteUser, getUserById, getUsers, usersDetails } from "./User.controller.js";
import { login, register } from "./auth.controller.js";

const router = express.Router();

// Login routes
router.post("/register", register); // ok
router.post("/login", login); // ok

// Apply the auth middleare to routes that require authentication
router.use(checkToken);

// User routes
router.put("/users", usersDetails); // ok
router.get("/users", getUsers); // ok
router.get("/users/:id", getUserById); // ok
router.delete("/users", deleteUser); // ok

// Post routes
router.post("/posts", addPost); // ok
router.get("/posts/personal", getMyPosts); // ok
router.get("/posts/timeline", getFriendsPosts); // ok
router.get("/posts/:id", getPostById); // ok
router.delete("/posts/:id", deletePost); // ok


// Comment routes
router.post("/comments", addComment); // todo
router.get("/comments/:post_id", getCommentsFromPost); // todo
router.get("/comments/unique/:id", getCommentById); // todo
router.delete("/comments/:id", deleteComment); // todo

// Follow routes
router.post("/follows", addFollow); // ok
router.get("/follows", getFollows); // ok
router.get("/follows/followers", getFollowers); // ok
router.get("/follows/:follower_user_id/:followed_user_id", getFollowById); // ??
router.delete("/follows/:followed_user_id", deleteFollow); // ok

export default router;