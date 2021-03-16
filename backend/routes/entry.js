const express = require("express");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  endRoom,
  getRoomById,
  getUserById,
} = require("../controllers/entry");

const router = express.Router();

router.param("roomId", getRoomById);
router.param("userId", getUserById);

router.post("/create", createRoom);

router.post("/join", joinRoom);
router.delete("/leave/:roomId/:userId", leaveRoom);

module.exports = router;
