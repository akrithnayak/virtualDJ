import { API } from "../backend";

export const createRoom = async (room) => {
  return await fetch(`${API}/api/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const joinRoom = async (room) => {
  return await fetch(`${API}/api/join`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const leaveRoom = async (data) => {
  if (typeof window != "undefined") {
    localStorage.removeItem("token");

    return await fetch(`${API}/api/leave/${data.roomId}/${data.userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  }
};

export const endRoom = async (data) => {
  if (typeof window != "undefined") {
    localStorage.removeItem("token");

    return await fetch(`${API}/api/end/${data.roomId}/${data.userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  }
};

export const getRoom = async (data) => {
  return await fetch(`${API}/api/room/${data}`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
