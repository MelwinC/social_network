import express from "express";
import { addComment, deleteComment, getCommentById, getCommentsFromPost } from "./Comment.controller.js";
import { addFollow, deleteFollow, getFollowById, getFollowers, getFollows } from "./Follow.controller.js";
import checkToken from "../middlewares/auth.middleware.js";
import { addPost, deletePost, getFriendsPosts, getMyPosts, getPostById } from "./Post.controller.js";
import { deleteUser, getUserById, getUsers, usersDetails } from "./User.controller.js";
import { login, register } from "./auth.controller.js";
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../docs/swagger.json' with { type: "json"};
import multer from "multer";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite de taille de fichier à 2MB
  }
});

const router = express.Router();

// Swagger route
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Login routes
router.post("/register", register); 
router.post("/login", login); 

// Apply the auth middleare to routes that require authentication
router.use(checkToken);

// User routes
router.put("/users", upload.single('photo'), usersDetails);
router.get("/users", getUsers); 
router.get("/users/:id", getUserById); 
router.delete("/users", deleteUser); 

// Post routes
router.post("/posts", addPost); 
router.get("/posts/personal", getMyPosts); 
router.get("/posts/timeline", getFriendsPosts); 
router.get("/posts/:id", getPostById); 
router.delete("/posts/:id", deletePost); 


// Comment routes
router.post("/comments", addComment); 
router.get("/comments/:post_id", getCommentsFromPost); 
router.get("/comments/unique/:id", getCommentById); 
router.delete("/comments/:id", deleteComment); 

// Follow routes
router.post("/follows", addFollow); 
router.get("/follows", getFollows); 
router.get("/follows/followers", getFollowers); 
router.get("/follows/:follower_user_id/:followed_user_id", getFollowById); // ??
router.delete("/follows/:followed_user_id", deleteFollow); 

export default router;