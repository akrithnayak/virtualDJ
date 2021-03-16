import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, joinRoom } from "../apicalls/room";
import "../css/Join.css";

class Join extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      username: "",
      code: "",
      error: "",
      didRedirect: false,
      roomId: "",
    };
  }

  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  onSubmit() {
    var { username, code } = this.state;
    this.setState({
      loading: true,
    });
    joinRoom({ username, code })
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          this.setState({
            error: data.error,
            loading: false,
          });
        } else {
          authenticate({ userId: data._id, roomId: data.room }, () => {
            this.setState({
              didRedirect: true,
              roomId: code,
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.didRedirect)
      return <Redirect to={`/room/${this.state.roomId}`} />;
    return (
      <div className="background-join">
        <div className="join-form-div">
          <Link to="/">
            <div className="join-back-button">Back</div>
          </Link>

          <div className="join-form-div-wrapper">
            <form action="" className="join-form">
              <h4 className="join-entry-message">
                {this.state.error ? this.state.error : ""}
              </h4>
              <div className="join-form-element-div">
                <input
                  className="join-form-elements"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={(e) => this.handleChange("username", e)}
                />
              </div>
              <div className="join-form-element-div">
                <input
                  className="join-form-elements"
                  type="text"
                  name="code"
                  placeholder="Enter party code"
                  value={this.state.code}
                  onChange={(e) => this.handleChange("code", e)}
                />
              </div>
              <div className="join-form-element-button" onClick={this.onSubmit}>
                Enter Party
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Join;
