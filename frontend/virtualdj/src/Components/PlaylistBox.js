import React, { Component } from "react";
import "../css/PlaylistBox.css";

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
        </div>
      </div>
    );
  }
}

export default Playlist;
