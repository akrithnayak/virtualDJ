import { Component } from "react";
import { Redirect } from "react-router-dom";
import { leaveRoom, endRoom, getRoom } from "../apicalls/room";
import { animateScroll } from "react-scroll";
import "../css/Room.css";
import { getTracks, getPlaylists } from "../apicalls/spotify";
import searchIcon from "../img/room/search.png";
import detailsIcon from "../img/room/details.png";
import Song from "./SongBox";
import Playlist from "./PlaylistBox";
import Player from "./Player";
import { io } from "socket.io-client";
import { API } from "../backend";
import Modal from "./Modal";

class Room extends Component {
  constructor(props) {
    super(props);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.endRoom = this.endRoom.bind(this);
    this.playSong = this.playSong.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.socketOperation = this.socketOperation.bind(this);
    this.toggleTrackPlaylist = this.toggleTrackPlaylist.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.state = {
      error: "",
      didRedirect: false,
      room: null,
      user: this.props.location.state.user,
      copied: "Copy",
      searchText: "",
      chatMessage: "",
      isTrack: true,
      trackResults: [],
      playlistResults: [],
      accessToken: "",
      trackUris: [],
      intervalObject: null,
      socket: null,
      isModalOpen: false,
    };
  }

  async socketOperation() {
    const socket = await io(API);
    await this.setState({
      socket,
    });

    this.state.socket.on("someone joined", async (room) => {
      this.setState(
        {
          room,
        },
        () => this.scrollToBottom("members")
      );
    });

    this.state.socket.on("receive message", async (room) => {
      this.setState(
        {
          room,
        },
        () => this.scrollToBottom("text-area")
      );
    });

    this.state.socket.on("someone left", async (room) => {
      this.setState({
        room,
      });
    });

    this.state.socket.on("everyone leave", async (members) => {
      this.setState({
        didRedirect: true,
      });
    });

    this.state.socket.emit("join room", this.state.room._id);

    return () => {
      socket.disconnect();
    };
  }

  componentDidMount() {
    getRoom(this.props.match.params.roomId)
      .then(async (room) => {
        await this.setState({ room, accessToken: room.admin.accesstoken });
        this.socketOperation();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sendMessage() {
    if (!this.state.chatMessage.trim()) return;
    this.state.socket.emit("send message", {
      roomId: this.state.room._id,
      userId: this.state.user._id,
      message: this.state.chatMessage,
    });
    this.setState({
      chatMessage: "",
    });
  }

  scrollToBottom(id) {
    animateScroll.scrollToBottom({
      containerId: id,
    });
  }

  playSong(trackUri) {
    this.setState({
      trackUris: [trackUri],
    });
  }

  playPlaylist(trackUris) {
    this.setState({
      trackUris: trackUris,
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

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  search() {
    this.setState({
      trackResults: [],
      playlistResults: [],
    });
    if (this.state.isTrack)
      getTracks(this.state.searchText).then((data) => {
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
    const data = {
      userId: this.state.user._id,
      roomId: this.state.room._id,
    };
    endRoom(data)
      .then(async (data) => {
        if (data.error) {
          this.setState({
            error: data.error,
          });
        } else {
          this.state.socket.emit("end party", this.state.room._id);
          this.setState({
            didRedirect: true,
          });
        }
      })
      .catch((err) =>
        this.setState({
          didRedirect: true,
        })
      );
  }

  leaveRoom() {
    const data = {
      userId: this.state.user._id,
      roomId: this.state.room._id,
    };
    leaveRoom(data)
      .then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
          });
        } else {
          this.state.socket.emit("leave room", this.state.room._id);
          this.setState({
            didRedirect: true,
          });
        }
      })
      .catch((err) =>
        this.setState({
          didRedirect: true,
        })
      );
  }

  render() {
    if (this.state.didRedirect || !this.state.user) return <Redirect to="/" />;

    const renderTrack = () => {
      return this.state.trackResults.map((track, id) => {
        return <Song key={id} track={track} playSong={this.playSong} />;
      });
    };

    const renderPlaylist = () => {
      return this.state.playlistResults.map((playlist, id) => {
        return (
          <Playlist
            key={id}
            playlist={playlist}
            playPlaylist={this.playPlaylist}
          />
        );
      });
    };

    const renderMember = () => {
      return (
        <div>
          {this.state.room.members.map((mem, id) => {
            return (
              <div key={id} className="room-member">
                <h3>
                  {mem.username}
                  {mem.role ? "(host)" : ""}
                </h3>
              </div>
            );
          })}
        </div>
      );
    };

    const renderChat = () => {
      return (
        <div>
          {this.state.room.chats.map((mes, id) => {
            return (
              <div key={id} className="chat-message-wrapper">
                <div
                  className={
                    mes.sender && this.state.user._id === mes.sender._id
                      ? "chat-sender"
                      : "chat-receiver"
                  }
                >
                  {mes.sender && this.state.user._id !== mes.sender._id ? (
                    <div className="chat-name">{mes.sender.username}</div>
                  ) : (
                    <div>
                      {!mes.sender ? (
                        <div className="chat-name">Ex-reveller</div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  <div className="chat-message">{mes.message}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="background-room">
        {this.state.user.role ? (
          <div className="room-leave-button" onClick={this.endRoom}>
            End party
          </div>
        ) : (
          <div className="room-leave-button" onClick={this.leaveRoom}>
            Leave party
          </div>
        )}

        {this.state.room && this.state.user ? (
          <Modal
            toggleModal={this.toggleModal}
            room={this.state.room}
            user={this.state.user}
            isOpen={this.state.isModalOpen}
          />
        ) : (
          ""
        )}
        <div className="room-song-details">
          {this.state.user ? (
            <div>
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
                    <span className="search-tooltiptext">Search</span>
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
              <div className="room-player-wrapper">
                <Player
                  accessToken={this.state.accessToken}
                  trackUris={this.state.trackUris}
                  admin={true}
                />
              </div>
            </div>
          ) : (
            <div className="room-player-wrapper">
              <Player
                accessToken={this.state.accessToken}
                trackUris={this.state.trackUris}
                admin={false}
              />
            </div>
          )}
        </div>

        <div className="room-chat-details">
          <div className="room-user">{this.state.user.username}</div>
          <img
            className="details-icon"
            src={detailsIcon}
            alt="Details"
            onClick={this.toggleModal}
          />
          <span className="details-tooltiptext">Details</span>

          <div className="room-members-wrapper" id="members">
            <div className="room-member-header">
              Partyholics
              <div>
                Revellers:{" "}
                {this.state.room && this.state.room.members.length
                  ? this.state.room.members.length
                  : 0}
              </div>
            </div>
            {this.state.room && this.state.room.members.length ? (
              renderMember()
            ) : (
              <div></div>
            )}
          </div>
          <div className="room-chat-wrapper">
            <div className="room-chat-header">Chat room</div>
            <div className="room-text-area" id="text-area">
              <div className="room-text-area-label">Party begins</div>
              {this.state.room && this.state.room.chats.length ? (
                renderChat()
              ) : (
                <div></div>
              )}
            </div>
            <div className="room-chat-message-wrapper">
              <div className="room-chat-text-wrapper">
                <input
                  type="text"
                  className="room-chat-text"
                  value={this.state.chatMessage}
                  onChange={(e) => this.handleChange("chatMessage", e)}
                  placeholder="Type message"
                />
              </div>
              <div className="room-chat-send-button" onClick={this.sendMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="currentColor"
                    d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Room;
