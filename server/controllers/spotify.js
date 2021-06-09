const Room = require("../models/room");
const fetch = require("node-fetch");

require("dotenv").config();

var scopes =
  "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing streaming app-remote-control user-read-email user-read-private playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played user-follow-read user-follow-modify";

var isCreate = false;

exports.setCredentials = (req, res) => {
  var url =
    "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" +
    process.env.CLIENT_ID +
    "&scope=" +
    encodeURIComponent(scopes) +
    "&redirect_uri=" +
    encodeURIComponent(process.env.REDIRECT_URI);
  isCreate = req.query.isCreate === "create";

  return res.json({
    url,
  });
};

exports.getTracks = async (req, res) => {
  const data = await fetch(
    `https://api.spotify.com/v1/search?q=${req.query.trackName}&type=track&limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.user.accesstoken,
      },
    }
  )
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  return res.json(data.tracks.items);
};

exports.getPlaylists = async (req, res) => {
  const data = await fetch(
    `https://api.spotify.com/v1/search?q=${req.query.playlistName}&type=playlist&limit=50`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.user.accesstoken,
      },
    }
  )
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      console.log(err);
      return;
    });
  return res.json(data.playlists.items);
};

exports.callback = async (req, res) => {
  const { code } = req.query;
  var details = {
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const data = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody,
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      console.log(err);
    });

  if (isCreate)
    res.redirect(
      process.env.REDIRECT_CREATE_URL + "?access_token=" + data.access_token
    );
  else
    res.redirect(
      process.env.REDIRECT_JOIN_URL + "?access_token=" + data.access_token
    );
};

exports.getAccessToken = (req, res) => {
  return res.json({
    accessToken: req.user.accesstoken,
  });
};

exports.getCurrentPlaybackState = async (req, res) => {
  const data = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + req.user.accesstoken,
    },
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return {};
    });
  return res.json(data);
};
