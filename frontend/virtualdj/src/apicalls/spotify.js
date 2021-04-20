import { API } from "../backend";

export const setCredentials = () => {
  return fetch(`${API}/spotify/set`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTracks = (trackName) => {
  return fetch(`${API}/gettracks`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackName }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getPlaylists = (playlistName) => {
  return fetch(`${API}/getplaylists`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playlistName }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getAudioFeat = (trackId) => {
  return fetch(`${API}/getaudiofeat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getDevices = () => {
  return fetch(`${API}/devices`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getAccessToken = () => {
  return fetch(`${API}/getaccesstoken`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
