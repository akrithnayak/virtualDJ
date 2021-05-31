const Room = require("../models/room");
const fetch = require("node-fetch");
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

  socket.on("playback changed", async ({ room, data }) => {
    io.to(room._id).emit("play", data);
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

async function playHelper({ room, socket }) {
  var data = {};
  while (!data.item) {
    data = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + room.admin.accesstoken,
        },
      }
    )
      .then((data) => {
        return data.json();
      })
      .catch((err) => {
        return {};
      });
  }
  // console.log(data);
  socket.broadcast.to(room._id).emit("play", data);
}
