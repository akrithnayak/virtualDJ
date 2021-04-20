import React, { Component } from "react";
import "../css/SongBox.css";
import playBtn from "../img/songbox/play.png";

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: this.props.track,
      link: this.props.track.external_urls.spotify,
    };
  }

  render() {
    return (
      <div className="songbox-wrapper">
        <div className="songbox-image-wrapper">
          <img
            className="songbox-image"
            src={this.state.track.album.images[0].url}
            alt={this.state.track.name}
          />
        </div>
        <div className="songbox-details">
          <div>Name: {this.state.track.name}</div>
          <div>
            Time:{" "}
            {new Date(this.state.track.duration_ms).toISOString().substr(14, 5)}
          </div>
          <div>Artist: {this.state.track.artists[0].name}</div>
          <div className="songbox-play">
            <img
              src={playBtn}
              alt="Play"
              className="songbox-play-img"
              onClick={() => this.props.playSong(this.state.track.uri)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Song;
