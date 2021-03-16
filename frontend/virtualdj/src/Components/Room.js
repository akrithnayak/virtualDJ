import { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, leaveRoom } from "../apicalls/room";
import "../css/Room.css";

class Room extends Component {
  constructor(props) {
    super(props);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.state = {
      name: "",
      username: "",
      max: "",
      description: "",
      error: "",
      loading: false,
      didRedirect: false,
      roomId: "",
    };
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
        <div className="room-leave-button" onClick={this.leaveRoom}>
          Leave party
        </div>
        <div className="room-song-details">Play controls</div>
        <div className="room-chat">Chat</div>
      </div>
    );
  }
}

export default Room;
