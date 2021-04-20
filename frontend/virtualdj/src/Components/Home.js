import React, { Component } from "react";
import { Link } from "react-router-dom";
import { setCredentials } from "../apicalls/spotify";
import sound from "../audio/bg.mp3";
import "../css/Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.goNext = this.goNext.bind(this);
    this.state = {};
  }

  goNext() {
    setCredentials().then((data) => {
      window.location.assign(data.url);
    });
  }

  render() {
    return (
      <div className="background-home">
        <div>
          <audio src={sound} autoPlay loop />
        </div>
        <div className="background-outer">
          <div className="buttons-group">
            <div className="buttons-wrapper-home">
              <div className="buttons-home" onClick={this.goNext}>
                Create Room
              </div>
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
