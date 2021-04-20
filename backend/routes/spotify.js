const express = require("express");

const {
  getTracks,
  setCredentials,
  getPlaylists,
  getAudioFeat,
  getDevices,
  callback,
  getAccessToken,
} = require("../controllers/spotify");

const router = express.Router();

router.get("/spotify/set", setCredentials);
router.get("/callback", callback);
router.get("/getaccesstoken", getAccessToken);

router.post("/gettracks", getTracks);
router.post("/getplaylists", getPlaylists);

router.get("/devices", getDevices);
router.post("/getaudiofeat", getAudioFeat);

module.exports = router;
