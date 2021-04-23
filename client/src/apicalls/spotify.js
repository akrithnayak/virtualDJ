import { API } from "../backend";

export const setCredentials = async () => {
  return await fetch(`${API}/api/spotify/set`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTracks = async (trackName) => {
  return await fetch(`${API}/api/gettracks`, {
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

export const getPlaylists = async (playlistName) => {
  return await fetch(`${API}/api/getplaylists`, {
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

export const getAccessToken = async () => {
  return await fetch(`${API}/api/getaccesstoken`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
