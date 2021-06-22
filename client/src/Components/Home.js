import React, { Component } from "react";
import { setCredentials } from "../apicalls/spotify";
// import sound from "../audio/bg.mp3";
import "../css/Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.goNext = this.goNext.bind(this);
    this.state = {};
  }

  goNext(query) {
    setCredentials(query)
      .then((data) => {
        window.location.assign(data.url);
      })
      .catch((err) => {
        console.log(err);
        console.log("Something went wrong");
      });
  }

  // componentDidMount() {
  //   const audio = new Audio(sound);
  //   audio.play();
  // }

  render() {
    return (
      <div className="background-home">
        <div className="background-outer">
          <div className="buttons-group">
            <div className="buttons-wrapper-home">
              <div
                className="buttons-home"
                onClick={() => this.goNext("create")}
              >
                Create Room
              </div>

              <div className="buttons-home" onClick={() => this.goNext("join")}>
                Join Room
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
