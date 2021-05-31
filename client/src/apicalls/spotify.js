import { API } from "../backend";

export const setCredentials = async (isCreate) => {
  var url = new URL(`${API}/api/spotify/set`);
  var params = { isCreate };
  url.search = new URLSearchParams(params).toString();
  return await fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTracks = async ({ trackName, userId }) => {
  if (!trackName) return [];
  var url = new URL(`${API}/api/gettracks/${userId}`);
  var params = { trackName };
  url.search = new URLSearchParams(params).toString();
  return await fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getPlaylists = async ({ playlistName, userId }) => {
  var url = new URL(`${API}/api/getplaylists/${userId}`);
  var params = { playlistName };
  url.search = new URLSearchParams(params).toString();
  return await fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getCurrentPlaybackState = async ({ userId }) => {
  return await fetch(`${API}/api/getplaybackstate/${userId}`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getAccessToken = async () => {
  return await fetch(`${API}/api/getaccesstoken`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateCurrentPlayback = async (data) => {
  return await fetch(
    `${API}/api/updatecurrentplayback/${data.room.admin._id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const adminPlaybackSync = async (param) => {
  if (!param.data.track || param.user.role) return;

  if (param.data.isPlaying) {
    const url = param.currentDeviceId
      ? `https://api.spotify.com/v1/me/player/play?device_id=${param.currentDeviceId}`
      : "https://api.spotify.com/v1/me/player/play";
    return await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${param.user.accesstoken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [param.data.track.uri],
        position_ms: param.data.progressMs,
      }),
    });
  }
  if (!param.data.isPlaying) {
    await fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${param.data.progressMs}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${param.user.accesstoken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      headers: {
        Authorization: `Bearer ${param.user.accesstoken}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
  }
};
