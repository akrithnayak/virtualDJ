import { Component } from "react";
import { Redirect } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isAuthenticated, leaveRoom, endRoom, getRoom } from "../apicalls/room";
import "../css/Room.css";
import { getTracks, getPlaylists, getAccessToken } from "../apicalls/spotify";
import searchIcon from "../img/room/search.png";
import Song from "./SongBox";
import Playlist from "./PlaylistBox";
import Player from "./Player";

class Room extends Component {
  constructor(props) {
    super(props);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.endRoom = this.endRoom.bind(this);
    this.playSong = this.playSong.bind(this);
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleTrackPlaylist = this.toggleTrackPlaylist.bind(this);
    this.state = {
      error: "",
      loading: false,
      didRedirect: false,
      room: "",
      copied: "Copy",
      searchText: "",
      isTrack: true,
      trackResults: [],
      playlistResults: [],
      accessToken: "",
      trackUri: "",
    };
  }

  componentDidMount() {
    getRoom(this.props.match.params.roomId).then((room) => {
      this.setState({ room });
    });
    getAccessToken()
      .then((data) => {
        console.log(data.expiresIn);
        this.setState({
          accessToken: data.accessToken,
        });
      })
      .catch(() => {
        console.log("Somethin went wrong");
      });
  }

  playSong(trackUri) {
    this.setState({
      trackUri,
    });
  }

  handleChange(name, event) {
    var value = event.target.value;
    this.setState({
      [name]: value,
    });
  }

  toggleTrackPlaylist() {
    this.setState({
      isTrack: !this.state.isTrack,
    });
  }

  search() {
    this.setState({
      trackResults: [],
      playlistResults: [],
    });
    if (this.state.isTrack)
      getTracks(this.state.searchText).then((data) => {
        console.log(data);
        this.setState({
          trackResults: data,
          playlistResults: [],
        });
      });
    else
      getPlaylists(this.state.searchText).then((data) => {
        console.log(data);
        this.setState({
          playlistResults: data,
          trackResults: [],
        });
      });
  }

  endRoom() {
    const data = isAuthenticated();
    endRoom(data)
      .then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
            loading: false,
          });
        } else {
          this.setState({
            didRedirect: true,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  leaveRoom() {
    const data = isAuthenticated();
    leaveRoom(data)
      .then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
            loading: false,
          });
        } else {
          this.setState({
            didRedirect: true,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.didRedirect || !isAuthenticated())
      return <Redirect to="/" />;

    const renderTrack = () => {
      return this.state.trackResults.map((track, id) => {
        return <Song key={id} track={track} playSong={this.playSong} />;
      });
    };

    const renderPlaylist = () => {
      return this.state.playlistResults.map((playlist, id) => {
        return <Playlist key={id} playlist={playlist} />;
      });
    };

    return (
      <div className="background-room">
        {isAuthenticated().role ? (
          <div className="room-leave-button" onClick={this.endRoom}>
            End party
          </div>
        ) : (
          <div className="room-leave-button" onClick={this.leaveRoom}>
            Leave party
          </div>
        )}
        <div className="room-song-details">
          {isAuthenticated().role ? (
            <div className="track-playlist-wrapper">
              <div className="track-playlist-header-wrapper">
                <div
                  className={
                    this.state.isTrack
                      ? "track-header-selected"
                      : "track-header"
                  }
                  onClick={this.toggleTrackPlaylist}
                >
                  Tracks
                </div>
                <div
                  className={
                    this.state.isTrack
                      ? "playlist-header"
                      : "playlist-header-selected"
                  }
                  onClick={this.toggleTrackPlaylist}
                >
                  Playlists
                </div>
              </div>
              <div className="track-playlist-search">
                <input
                  type="text"
                  className="room-search-text"
                  value={this.state.searchText}
                  onChange={(e) => this.handleChange("searchText", e)}
                  placeholder="Search"
                />
                <div className="room-search">
                  <img
                    src={searchIcon}
                    alt=""
                    className="search-icon"
                    onClick={this.search}
                  />
                </div>
              </div>
              <div className="track-playlist-search-results">
                {this.state.trackResults.length && this.state.isTrack
                  ? renderTrack()
                  : this.state.playlistResults.length && !this.state.isTrack
                  ? renderPlaylist()
                  : ""}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {this.state.accessToken && this.state.trackUri ? (
            <div className="room-player-wrapper">
              <Player
                accessToken={this.state.accessToken}
                trackUri={this.state.trackUri}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div className="room-chat">
          <CopyToClipboard
            text={this.state.room.code}
            onCopy={() => this.setState({ copied: "Copied" })}
          >
            <div className="room-code">
              Party code: {this.state.room.code}
              <span className="room-tooltiptext">{this.state.copied}</span>
            </div>
          </CopyToClipboard>
        </div>
      </div>
    );
  }
}

export default Room;
