const Room = require("../models/room");
const io = require("../app.js");

exports.socketHandler = (socket, io) => {
  socket.on("join room", async (roomId) => {
    socket.join(roomId);
    const room = await findRoom(roomId);
    io.to(roomId).emit("someone joined", room);
  });

  socket.on("send message", ({ roomId, userId, message }) => {
    Room.findById(roomId, (err, room) => {
      if (err || !room) return;

      room.chats.push({ message, sender: userId });
      room.save(async (err, room_) => {
        const room = await findRoom(roomId);
        io.to(roomId).emit("receive message", room);
      });
    });
  });

  socket.on("leave room", async (roomId) => {
    socket.leave(roomId);
    const room = await findRoom(roomId);
    io.to(roomId).emit("someone left", room);
  });

  socket.on("end party", async (roomId) => {
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit("everyone leave", []);
  });
};

async function findRoom(id) {
  return await Room.findById(id)
    .populate("members")
    .populate("admin", "accesstoken username")
    .populate({
      path: "chats",
      populate: {
        path: "sender",
      },
    });
}
