import { Component } from "react";
import { Redirect } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isAuthenticated, leaveRoom, endRoom, getRoom } from "../apicalls/room";
import "../css/Room.css";

class Room extends Component {
  constructor(props) {
    super(props);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.endRoom = this.endRoom.bind(this);
    this.state = {
      error: "",
      loading: false,
      didRedirect: false,
      room: "",
      copied: "Copy",
    };
  }

  componentDidMount() {
    getRoom(this.props.match.params.roomId).then((room) => {
      this.setState({ room });
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

        <div className="room-song-details">Play controls</div>
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
