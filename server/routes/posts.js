import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READER */
router.get("/", verifyToken, getFeedPosts); //think to use ML for posts that will be the similarly
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;