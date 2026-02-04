import { Router } from "express";
import { verifyJWT_username } from "../middlewares/verifyJWT.middleware.js";
import {
  createVideoCallRequest,
  getVideoCallRequests,
  updateVideoCallRequestStatus,
  getVideoCallRequestsByChat,
} from "../controllers/videoCallRequest.controllers.js";

const router = Router();

// Create video call request
router.route("/create").post(verifyJWT_username, createVideoCallRequest);

// Get all pending video call requests for the logged-in user
router.route("/getPending").get(verifyJWT_username, getVideoCallRequests);

// Update video call request status
router.route("/updateStatus").post(verifyJWT_username, updateVideoCallRequestStatus);

// Get video call requests from a specific user in a chat
router.route("/getByChat/:senderUsername").get(verifyJWT_username, getVideoCallRequestsByChat);

export default router;
