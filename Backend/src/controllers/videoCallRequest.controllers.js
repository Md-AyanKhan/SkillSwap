import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { VideoCallRequest } from "../models/videoCallRequest.model.js";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/SendMail.js";

export const createVideoCallRequest = asyncHandler(async (req, res) => {
  console.log("******** Inside createVideoCallRequest Function *******");

  const { date, time, receiverUsername } = req.body;

  if (!date || !time || !receiverUsername) {
    throw new ApiError(400, "Please provide all the details");
  }

  const receiver = await User.findOne({ username: receiverUsername });

  if (!receiver) {
    throw new ApiError(404, "User not found");
  }

  const videoCallRequest = await VideoCallRequest.create({
    sender: req.user._id,
    receiver: receiver._id,
    senderName: req.user.name,
    meetingDate: date,
    meetingTime: time,
    status: "pending",
  });

  if (!videoCallRequest) {
    throw new ApiError(500, "Error creating video call request");
  }

  return res.status(201).json(new ApiResponse(201, videoCallRequest, "Video call request created successfully"));
});

export const getVideoCallRequests = asyncHandler(async (req, res) => {
  console.log("******** Inside getVideoCallRequests Function *******");

  const requests = await VideoCallRequest.find({
    receiver: req.user._id,
    status: "pending",
  })
    .populate("sender", "name username picture")
    .sort({ createdAt: -1 });

  if (!requests) {
    throw new ApiError(500, "Error fetching video call requests");
  }

  return res.status(200).json(new ApiResponse(200, requests, "Video call requests fetched successfully"));
});

export const updateVideoCallRequestStatus = asyncHandler(async (req, res) => {
  console.log("******** Inside updateVideoCallRequestStatus Function *******");

  const { requestId, status } = req.body;

  if (!requestId || !status || !["accepted", "rejected"].includes(status)) {
    throw new ApiError(400, "Please provide valid request ID and status");
  }

  const videoCallRequest = await VideoCallRequest.findByIdAndUpdate(
    requestId,
    { status: status },
    { new: true }
  );

  if (!videoCallRequest) {
    throw new ApiError(404, "Video call request not found");
  }

  return res.status(200).json(new ApiResponse(200, videoCallRequest, `Video call request ${status} successfully`));
});

export const getVideoCallRequestsByChat = asyncHandler(async (req, res) => {
  console.log("******** Inside getVideoCallRequestsByChat Function *******");

  const { senderUsername } = req.params;

  const sender = await User.findOne({ username: senderUsername });

  if (!sender) {
    throw new ApiError(404, "User not found");
  }

  const requests = await VideoCallRequest.find({
    sender: sender._id,
    receiver: req.user._id,
    status: { $in: ["pending", "accepted"] },
  }).sort({ createdAt: -1 });

  if (!requests) {
    throw new ApiError(500, "Error fetching video call requests");
  }

  return res.status(200).json(new ApiResponse(200, requests, "Video call requests fetched successfully"));
});
