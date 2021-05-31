const express = require("express");
const { getUserById } = require("../controllers/entry");

const {
  getTracks,
  setCredentials,
  getPlaylists,
  callback,
  getAccessToken,
  getCurrentPlaybackState,
  updateCurrentPlayback,
} = require("../controllers/spotify");

const router = express.Router();

router.param("userId", getUserById);

router.get("/spotify/set", setCredentials);
router.get("/callback", callback);
router.get("/getaccesstoken/:userId", getAccessToken);

router.get("/gettracks/:userId", getTracks);
router.get("/getplaylists/:userId", getPlaylists);
router.get("/getplaybackstate/:userId", getCurrentPlaybackState);

router.put("/updatecurrentplayback/:userId", updateCurrentPlayback);
module.exports = router;
