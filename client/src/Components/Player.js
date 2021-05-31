import SpotifyPlayer from "react-spotify-web-playback";

import React, { useEffect, useState } from "react";

export default function Player({
  accessToken,
  trackUri,
  admin,
  playBackController,
  loadUserPlayback,
}) {
  const [play, setPlay] = useState(true);
  const [isLoaded, setisLoaded] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  const playerStyles = {
    activeColor: "#fff",
    bgColor: "black",
    color: "#fff",
    loaderColor: "#fff",
    sliderColor: "#1cb954",
    trackArtistColor: "#ccc",
    trackNameColor: "#fff",
  };

  if (!accessToken) return <div></div>;
  if (admin)
    return (
      <SpotifyPlayer
        token={accessToken}
        autoPlay
        callback={async (state) => {
          if (!state.isPlaying) setPlay(false);
          await playBackController(state);
        }}
        play={play}
        uris={trackUri}
        magnifySliderOnHover
        styles={playerStyles}
        name="Player"
      />
    );
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={async (state) => {
        if (!state.isPlaying) setPlay(false);
        await loadUserPlayback(state);
        if (state.status === "READY") {
          await loadUserPlayback(state);
          setisLoaded(true);
        }
      }}
      play={play}
      uris={trackUri}
      magnifySliderOnHover
      styles={playerStyles}
      name="Player"
    />
  );
}
