import React, { Component } from "react";
import "../css/SongBox.css";
import playBtn from "../img/box/play.png";

class Song extends Component {
  render() {
    const { track, isAdmin } = this.props;
    return (
      <div className="songbox-wrapper">
        <div className="songbox-image-wrapper">
          <img
            className="songbox-image"
            src={track.album.images[0].url}
            alt={track.name}
          />
        </div>
        <div className="songbox-details">
          <div>Name: {track.name}</div>
          <div>
            Time: {new Date(track.duration_ms).toISOString().substr(14, 5)}
          </div>
          <div>Artist: {track.artists[0].name}</div>
          {isAdmin ? (
            <div className="songbox-play">
              <img
                src={playBtn}
                alt="Play"
                className="songbox-play-img"
                onClick={() => this.props.playSong(track.uri)}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Song;
