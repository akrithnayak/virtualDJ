import React from "react";
import "../css/Modal.css";
import closeBtn from "../img/modal/close.png";
import copyBtn from "../img/modal/copy.png";
import { useSpring, animated } from "react-spring";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Modal({ toggleModal, isOpen, room, user }) {
  const MODAL_STYLES = useSpring({
    config: {
      duration: 500,
    },
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? `translateY(0%)` : `translateY(-105%)`,
    transitionTimingFunction: "ease-in",
  });

  const MODAL_WRAPPER_STYLES = useSpring({
    config: {
      duration: 500,
    },
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? `translate3d(100%,100%,0%)` : `translate3d(0%,0%,100%)`,
    transitionTimingFunction: "ease-in",
    zIndex: isOpen ? 200 : -100,
  });
  return (
    <div>
      <animated.div
        className="modal-wrapper"
        onClick={toggleModal}
        style={MODAL_WRAPPER_STYLES}
      >
        <img className="modal-close-button" alt="Close" src={closeBtn} />
      </animated.div>

      <animated.div className="modal-room-details" style={MODAL_STYLES}>
        <div className="party-details-header">Party Details</div>
        <div className="party-details-wrapper">
          <div className="party-detailer">Party name: {room.name}</div>
          <div className="party-detailer">Host: {room.admin.username}</div>
          <div className="party-detailer">Username: {user.username}</div>
          <div className="party-detailer">Revellers: {room.members.length}</div>
          <div className="party-detailer">
            Code: {room.code}
            <CopyToClipboard text={room.code}>
              <img src={copyBtn} alt="Copy" className="copy-icon" />
            </CopyToClipboard>
          </div>
          <div className="party-detailer-description">
            <div>Description:</div> <p>{room.description}</p>
          </div>
        </div>
      </animated.div>
    </div>
  );
}
