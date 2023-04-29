import express from "express";
import { 
    getUser,
    getUserFriends,
    addRemoveFriend,
 } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
//this route is users/:id, for ex: users/ideije54844fefe5fe
//this route before verify the token
//this route get User at the getUser controller passed here
router.get("/:id", verifyToken, getUser);

//this route get friends of a User
router.get("/:id/friends", verifyToken, getUserFriends);


/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;