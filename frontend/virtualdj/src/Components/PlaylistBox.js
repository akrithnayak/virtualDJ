import React, { Component } from "react";
import "../css/PlaylistBox.css";
import playBtn from "../img/box/play.png";

class Playlist extends Component {
  state = {};
  render() {
    const playlist = this.props.playlist;
    return (
      <div className="playlistbox-wrapper">
        <div className="playlistbox-image-wrapper">
          <img
            className="playlistbox-image"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
        </div>
        <div className="playlistbox-details">
          <div>Name: {playlist.name}</div>
          <div>Owner: {playlist.owner.display_name}</div>
          <div>Total tracks: {playlist.tracks.total}</div>
          <div className="playlistbox-play">
            <img
              src={playBtn}
              alt="Play"
              className="playlistbox-play-img"
              onClick={() => this.props.playPlaylist(playlist.uri)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Playlist;
