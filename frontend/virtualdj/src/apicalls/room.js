import { API } from "../backend";

export const createRoom = (room) => {
  return fetch(`${API}/create`, {
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

export const joinRoom = (room) => {
  return fetch(`${API}/join`, {
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

export const leaveRoom = (data) => {
  if (typeof window != "undefined") {
    localStorage.removeItem("token");

    return fetch(`${API}/leave/${data.roomId}/${data.userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  }
  // return fetch(`${API}/leave/${data.roomId}/${data.userId}`, {
  //   method: "DELETE",
  //   // headers: {
  //   //   Accept: "application/json",
  //   //   "Content-Type": "application/json",
  //   // },
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .catch((err) => console.log(err));
};

export const authenticate = (data, next) => {
  if (typeof window != "undefined") {
    localStorage.setItem("token", JSON.stringify(data));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("token"));
  } else {
    return false;
  }
};
