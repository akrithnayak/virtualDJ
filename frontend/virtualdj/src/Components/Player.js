import SpotifyPlayer from "react-spotify-web-playback";

import React, { useEffect, useState } from "react";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  const playerStyles = {
    color: "red",
    background: "black",
  };

  if (!accessToken) return <div></div>;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
        else setPlay(true);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
      magnifySliderOnHover
      styles={playerStyles}
    />
  );
}
