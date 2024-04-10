const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

// Get user(if Auth)
router.post("/check-auth", userController.verifyToken, userController.get_user);

// Create user
router.post("/sign-up", userController.create_user);

// Login user
router.post("/login", userController.login_user);

// Update user
router.post("/become-member", userController.verifyToken, userController.become_member);

router.post("/become-admin", userController.verifyToken, userController.become_admin);

// Get all messages
router.get("/messages", messageController.get_messages);

// Create message
router.post("/create-message", userController.verifyToken, messageController.create_message);

// Delete message
router.post("/delete-message/:id", userController.verifyToken, messageController.delete_message);

module.exports = router;
