const Room = require("../models/room");
const User = require("../models/user");

function codeGenerator() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.getRoomById = (req, res, next, id) => {
  Room.findById(id)
    .populate("admin", "accesstoken")
    .exec((err, room) => {
      if (err || !room) {
        return res.status(400).json({
          error: "Room not found!",
        });
      }
      req.room = room;
      next();
    });
};

exports.getUserById = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Room not found!",
      });
    }
    req.user = user;
    next();
  });
};

exports.createRoom = (req, res) => {
  User.create(
    { username: req.body.username, role: 1, accesstoken: req.body.accessToken },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "User account couldn't be created",
        });
      }
      var room = {
        name: req.body.name,
        code: codeGenerator(),
        members: [user._id],
        max: req.body.max,
        admin: user._id,
        description: req.body.description,
      };
      Room.create(room, (err, room) => {
        if (err) {
          return res.status(400).json({
            error: "Room couldn't be created",
          });
        }
        user.room = room._id;
        user.save();
        return res.json({ user, room });
      });
    }
  );
};

exports.joinRoom = (req, res) => {
  Room.findOne({ code: req.body.code })
    .populate("members")
    .populate("admin", "accesstoken")
    .exec((err, room) => {
      if (err || !room) {
        return res.status(400).json({
          error: "Invalid code!!",
        });
      }
      for (var i = 0; i < room.members.length; i++) {
        if (room.members[i].username === req.body.username)
          return res.status(400).json({
            error: "User with this username already exists in the party!",
          });
      }
      if (room.members.length + 1 > room.max)
        return res.status(400).json({
          error: "Party is full!",
        });
      User.create(
        {
          username: req.body.username,
          role: 0,
          accesstoken: room.admin.accesstoken,
        },
        (err, user) => {
          if (err) {
            return res.status(400).json({
              error: "User account couldn't be created",
            });
          }
          room.members.push(user._id);
          room.save();
          user.room = room._id;
          user.save();
          return res.json(user);
        }
      );
    });
};

exports.leaveRoom = (req, res) => {
  Room.findById(req.room._id).exec((err, room) => {
    if (err || !room) {
      return res.status(400).json({
        error: "Room not found",
      });
    }
    members = [];

    for (var i = 0; i < room.members.length; i++) {
      temp = room.members[i];
      if (String(temp._id) != String(req.user._id))
        members.push(room.members[i]);
    }
    if (members.length === room.members.length) {
      return res.status(400).json({
        error: "User not present in the room!",
      });
    }
    if (members.length === 0) {
      Room.deleteOne({ _id: req.room._id }).exec((err) => {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        }
        User.deleteOne({ _id: req.user._id }).exec((err) => {
          if (err) {
            return res.status(400).json({ error: "Something went wrong" });
          }
          return res.json({
            msg: "Left the party",
          });
        });
      });
    } else {
      room.members = members;
      room.save();
      User.deleteOne({ _id: req.user._id }).exec((err) => {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        }
        return res.json({
          msg: "Left the party",
        });
      });
    }
  });
};

exports.endRoom = (req, res) => {
  Room.findById(req.room._id).exec((err, room) => {
    if (err || !room) {
      return res.status(400).json({
        error: "Room not found",
      });
    }
    if (!req.user.role) {
      return res.status(400).json({
        error: "Access denied",
      });
    }
    members = [];

    for (var i = 0; i < room.members.length; i++) {
      temp = room.members[i];
      async function deleteUserTask(id) {
        return await User.findByIdAndRemove(id);
      }
      deleteUserTask(temp._id);
    }
    Room.deleteOne({ _id: req.room._id }).exec((err) => {
      if (err) {
        return res.status(400).json({ error: "Something went wrong" });
      }
      return res.status(200).json({
        msg: "Party ended!",
      });
    });
  });
};

exports.getUser = (req, res) => {
  return res.json(req.user);
};

exports.getRoom = (req, res) => {
  return res.json(req.room);
};
