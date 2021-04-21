const SpotifyWebApi = require("spotify-web-api-node");

require("dotenv").config();

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

exports.setCredentials = (req, res) => {
  var url = spotifyApi.createAuthorizeURL(scopes);
  return res.json({
    url,
  });
};

var offset = 0;

exports.getTracks = (req, res) => {
  spotifyApi
    .searchTracks(req.body.trackName, { limit: 40, offset })
    .then((data) => {
      offset = 40;
      return res.json(data.body.tracks.items);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};

exports.getPlaylists = (req, res) => {
  spotifyApi
    .searchPlaylists(req.body.playlistName, { limit: 40, offset })
    .then((data) => {
      offset = 40;
      return res.json(data.body.playlists.items);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};

exports.getAudioFeat = (req, res) => {
  spotifyApi
    .getAudioFeaturesForTrack(req.body.trackId)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};

exports.getDevices = (req, res) => {
  spotifyApi
    .getMyDevices()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};

exports.callback = (req, res) => {
  const { code } = req.query;
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      spotifyApi.expiresIn = data.body.expires_in;
      res.redirect(process.env.REDIRECT_USER_URL);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};

exports.getAccessToken = (req, res) => {
  return res.json({
    accessToken: spotifyApi.getAccessToken(),
    refreshToken: spotifyApi.getRefreshToken(),
    expiresIn: spotifyApi.expiresIn,
  });
};
