const SpotifyWebApi = require("spotify-web-api-node");
const { SpotifyPlaybackSDK } = require("spotify-playback-sdk-node");

const spotifyApi = new SpotifyWebApi({
  clientId: "0f96e54882e740a1b45d43176e88b78a",
  clientSecret: "aebe2c44be11466fb59709e8f3e3833f",
  redirectUri: "http://localhost:3001/callback",
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

// exports.setCredentials = (req, res) => {
//   spotifyApi
//     .clientCredentialsGrant()
//     .then((data) => {
//       spotifyApi.setAccessToken(data.body["access_token"]);
//       token = data.body["access_token"];
//       return res.json({
//         data,
//       });
//     })
//     .catch((err) => {
//       return res.json({
//         err,
//       });
//     });
// };

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

const spotify = new SpotifyPlaybackSDK();

exports.callback = (req, res) => {
  const { code } = req.query;
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      res.redirect(`http://localhost:3000/create`);
    })
    .catch((err) => {
      if (err) {
        return res.json({
          err,
        });
      }
    });
};
