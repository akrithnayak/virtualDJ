const express = require("express");

const {
  createRoom,
  joinRoom,
  leaveRoom,
  endRoom,
  getRoomById,
  getUserById,
  getUser,
  getRoom,
} = require("../controllers/entry");

const router = express.Router();

router.param("roomId", getRoomById);
router.param("userId", getUserById);

router.post("/create", createRoom);

router.post("/join", joinRoom);
router.delete("/leave/:roomId/:userId", leaveRoom);
router.delete("/end/:roomId/:userId", endRoom);

router.get("/user/:userId", getUser);
router.get("/room/:roomId", getRoom);

module.exports = router;
