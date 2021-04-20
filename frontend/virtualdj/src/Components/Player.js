import SpotifyPlayer from "react-spotify-web-playback";

import React, { useEffect, useState } from "react";

export default function Player({ accessToken, trackUris, admin }) {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    setPlay(true);
  }, [trackUris]);

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
        showSaveIcon
        callback={(state) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUris}
        magnifySliderOnHover
        styles={playerStyles}
        name="Player"
      />
    );
  return (
    <SpotifyPlayer
      token={accessToken}
      play={true}
      syncExternalDevice
      syncExternalDeviceInterval={10}
      magnifySliderOnHover
      styles={playerStyles}
      name="Player"
    />
  );
}
