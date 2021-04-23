const express = require("express");

const {
  getTracks,
  setCredentials,
  getPlaylists,
  callback,
  getAccessToken,
} = require("../controllers/spotify");

const router = express.Router();

router.get("/spotify/set", setCredentials);
router.get("/callback", callback);
router.get("/getaccesstoken", getAccessToken);

router.post("/gettracks", getTracks);
router.post("/getplaylists", getPlaylists);

module.exports = router;
