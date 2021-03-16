import React, { Component } from "react";
import { Link } from "react-router-dom";
import sound from "../audio/bg.mp3";
import "../css/Home.css";

class Home extends Component {
  state = {};

  render() {
    return (
      <div className="background-home">
        <div>
          <audio src={sound} autoPlay loop />
        </div>
        <div className="background-outer">
          <div className="buttons-group">
            <div className="buttons-wrapper-home">
              <Link to="/create">
                <div className="buttons-home">Create Room</div>
              </Link>
              <Link to="/join">
                <div className="buttons-home">Join Room</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
