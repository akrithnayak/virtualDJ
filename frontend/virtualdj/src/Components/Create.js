import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, createRoom } from "../apicalls/room";
import "../css/Create.css";

class Create extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  handleChange(name, event) {
    var value = event.target.value;
    if (name === "max" && value === "0") value = "";
    this.setState({
      [name]: value,
    });
  }

  onSubmit() {
    console.log("hi");
    var { username, name, max, description } = this.state;
    if (max === "") max = 8;
    this.setState({
      loading: true,
    });
    createRoom({ username, name, max, description })
      .then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
            loading: false,
          });
        } else {
          authenticate({ userId: data.admin }, () => {
            this.setState({
              didRedirect: true,
              roomId: data.code,
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
      <div className="background-create">
        <div className="create-form-div">
          <Link to="/">
            <div className="create-back-button">Back</div>
          </Link>
          <div className="create-form-div-wrapper">
            <form action="" className="create-form">
              <div className="create-form-element-div">
                <input
                  className="create-form-elements"
                  type="text"
                  name="name"
                  placeholder="Enter room name"
                  value={this.state.name}
                  onChange={(e) => this.handleChange("name", e)}
                />
              </div>
              <div className="create-form-element-div">
                <input
                  className="create-form-elements"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={(e) => this.handleChange("username", e)}
                />
              </div>
              <div className="create-form-element-div">
                <input
                  className="create-form-elements"
                  type="number"
                  name="max"
                  placeholder="Max. people allowed"
                  value={this.state.max}
                  onChange={(e) => this.handleChange("max", e)}
                  min="1"
                />
              </div>
              <div className="create-form-element-div">
                <textarea
                  name="description"
                  id=""
                  cols="30"
                  rows="10"
                  value={this.state.description}
                  onChange={(e) => this.handleChange("description", e)}
                  className="create-form-elements"
                  placeholder="Party description..."
                ></textarea>
              </div>
              <div
                className="create-form-element-button"
                onClick={this.onSubmit}
              >
                Create Party
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
